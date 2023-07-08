import {BadRequestError, Body, JsonController, Post} from "routing-controllers"
import {Service} from "typedi"
import {AdminService} from "@app/services/admin.service"
import {Sequelize} from "sequelize"
import fs from "fs"
import path from "path"
import {execSync} from "child_process"
import {Plan} from "@app/models/plan.model"
import {User} from "@app/models/user.model"
import argon2 from "argon2"
import {Domain} from "@app/models/domain.model"
import {TpuConfigValidatorPartial} from "@app/validators/setup"

@Service()
@JsonController("/setup")
export class SetupControllerV3 {
    constructor(private readonly adminService: AdminService) {
    }

    @Post("/database")
    async setupDatabase(
        @Body()
            body: {
            host: string
            port: number
            database: string
            username: string
            password: string
        }
    ) {
        // setup sequelize with the provided credentials
        const sequelize = new Sequelize({
            host: body.host,
            port: body.port,
            database: body.database,
            username: body.username,
            password: body.password,
            dialect: "mariadb",
            logging: false
        })
        // test the connection
        try {
            await sequelize.authenticate()
            // write config/config.json
            const config = {
                development: {
                    username: body.username,
                    password: body.password,
                    database: body.database,
                    host: body.host,
                    port: body.port,
                    dialect: "mariadb",
                    logging: false
                },
                production: {
                    username: body.username,
                    password: body.password,
                    database: body.database,
                    host: body.host,
                    port: body.port,
                    dialect: "mariadb",
                    logging: false
                },
                test: {
                    username: body.username,
                    password: body.password,
                    database: body.database,
                    host: body.host,
                    port: body.port,
                    dialect: "mariadb",
                    logging: false
                }
            }
            if (!fs.existsSync(path.join(appRoot, "config"))) {
                fs.mkdirSync(path.join(appRoot, "config"))
            }
            await fs.writeFileSync(
                path.join(appRoot, "config", "config.json"),
                JSON.stringify(config, null, 2)
            )
            try {
                // try using system sequelize-cli first, only thing that works in Docker too
                execSync("sequelize db:migrate", {
                    env: process.env,
                    stdio: "inherit"
                })
            } catch {
                execSync(global.appRoot + "../node_modules/.bin/sequelize db:migrate", {
                    env: process.env,
                    stdio: "inherit"
                })
            }
        } catch (e) {
            //@ts-ignore
            throw new BadRequestError(e.message)
        }
    }

    @Post("/plan")
    async setupPlan(
        @Body()
            body: {
            name: string
            maxFileSize: number
            quotaMax: number
        }
    ) {
        return await Plan.create({
            name: body.name,
            internalFeatures: {
                maxFileSize: body.maxFileSize
            },
            quotaMax: body.quotaMax,
            id: 1,
            price: 0,
            purchasable: true,
            internalName: "FREE"
        })
    }

    @Post("/admin")
    async setupAdmin(
        @Body()
            body: {
            username: string
            password: string
            email: string
        }
    ) {
        return await User.create({
            username: body.username,
            password: await argon2.hash(body.password),
            email: body.email,
            emailVerified: true,
            planId: 1,
            id: 1,
            administrator: true
        })
    }

    @Post("/instance")
    async setupInstance(
        @Body()
            body: TpuConfig
    ) {
        await TpuConfigValidatorPartial.parse(body)
        let tpuConfig = global.config
        tpuConfig.siteName = body.siteName || "TPU"
        tpuConfig.hostname = body.hostname
        tpuConfig.hostnameWithProtocol = body.hostnameWithProtocol
        tpuConfig.port = body.port || 34582
        tpuConfig.threads = body.threads || 0
        tpuConfig.registrations = body.registrations
        tpuConfig.features = body.features
        tpuConfig.redis = body.redis
        tpuConfig.hostnames = [body.hostname, `www.${body.hostname}`]
        tpuConfig.preTrustedDomains.push(...tpuConfig.hostnames)
        await this.writeTPUConfig(tpuConfig)
    }

    async writeTPUConfig(tpuConfig: TpuConfig) {
        global.config = tpuConfig
        process.env.CONFIG = JSON.stringify(tpuConfig)
        if (!fs.existsSync(path.join(appRoot, "config"))) {
            fs.mkdirSync(path.join(appRoot, "config"))
        }
        await fs.writeFileSync(
            path.join(appRoot, "config", "tpu.json"),
            JSON.stringify(tpuConfig, null, 2)
        )
    }

    @Post("/mail/test")
    async testMail(
        @Body()
            body: {
            host: string
            port: number
            username: string
            password: string
            from: string
            testEmail: string
            secure: boolean
        }
    ) {
        await this.adminService.sendEmail(
            {
                body: {
                    intro: `It works!`,
                    title: `Test email from your PrivateUploader instance.`
                }
            },
            body.testEmail,
            "PrivateUploader test email",
            {
                host: body.host,
                port: body.port,
                username: body.username,
                password: body.password,
                from: body.from,
                secure: body.secure
            }
        )
    }

    @Post("/mail")
    async setupMail(
        @Body()
            body: {
            host: string
            port: number
            username: string
            password: string
            from: string
            secure: boolean
        }
    ) {
        // read from config/tpu.json
        let tpuConfig = global.config
        try {
            tpuConfig = require(path.join(appRoot, "config", "tpu.json"))
        } catch {
        }
        tpuConfig.email = {
            host: body.host,
            port: body.port,
            username: body.username,
            password: body.password,
            from: body.from,
            secure: body.secure
        }
        await this.writeTPUConfig(tpuConfig)
    }

    @Post("/restart")
    async restartTPU() {
        let tpuConfig = global.config
        try {
            tpuConfig = require(path.join(appRoot, "config", "tpu.json"))
        } catch {
        }
        try {
            if (
                await User.findOne({
                    where: {
                        id: 1
                    }
                })
            ) {
                tpuConfig.finishedSetup = true
                await this.writeTPUConfig(tpuConfig)
            }
        } catch {
        }
        if (!process.send) {
            throw new BadRequestError(
                "Please restart TPU manually.\nCluster mode is recommended for optimal performance."
            )
        }
        global.config = tpuConfig
        process.send("TPU_RESTART")
    }

    @Post("/domain")
    async setupDomain(
        @Body()
            body: {
            domain: string
        }
    ) {
        if (body?.domain?.length < 3) throw new BadRequestError("Invalid domain.")
        return await Domain.create({
            domain: body.domain,
            userId: 1,
            active: true,
            DNSProvisioned: true,
            id: 1
        })
    }
}
