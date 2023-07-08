import cluster from "cluster"
import os from "os"
import path from "path"
import {execSync} from "child_process"
import fs from "fs"

// Import Classes
import {DefaultTpuConfig} from "./classes/DefaultTpuConfig"

function isRunningInDocker(): boolean {
    try {
        const cgroup: string = fs.readFileSync("/proc/1/cgroup", "utf8")

        return cgroup.includes("docker")
    } catch {
        return false
    }
}

function setEnvVariables(): void {
    global.appRoot = path.resolve(__dirname).includes("out")
        ? path.join(__dirname, "..", "app")
        : path.join(__dirname)
    global.rawAppRoot = path.resolve(__dirname)

    try {
        global.config = require(global.appRoot + "/config/tpu.json")
    } catch {
        global.config = new DefaultTpuConfig().config
    }

    global.storageRoot = global.config.storage.startsWith("/")
        ? global.config.storage + "/"
        : path.join(global.appRoot, global.config.storage) + "/"
    process.env.APP_ROOT = global.appRoot
    process.env.RAW_APP_ROOT = global.rawAppRoot
    process.env.CONFIG = JSON.stringify(global.config)
    process.env.IS_DOCKER = isRunningInDocker() ? "true" : "false"
    process.env.STORAGE_ROOT = global.storageRoot

    if (global.config.finishedSetup) try {
        execSync("sequelize db:migrate", {
            env: process.env,
            stdio: "inherit"
        })
    } catch {
        try {
            execSync(global.appRoot + "../node_modules/.bin/sequelize db:migrate", {
                env: process.env,
                stdio: "inherit"
            })
        } catch {
            console.warn("[PRIVATEUPLOADER] Could not run sequelize-cli.")
        }
    }
}

if (cluster.isPrimary) {
    setEnvVariables()

    cluster.schedulingPolicy = cluster.SCHED_RR
    // Restrict to 2 processes if the setup is not finished to avoid slow restarts
    const cpus: number =
        !global.config?.finishedSetup && os.cpus().length >= 2
            ? 2
            : parseInt(process.env.THREADS || "0") ||
            global.config?.threads ||
            os.cpus().length

    console.info(`[PRIVATEUPLOADER] Clustering to ${cpus} CPUs…`)

    for (let i: number = 0; i < cpus; i++) {
        cluster.fork()
    }

    cluster.on("exit", (worker, code: number): void => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.error(`[PRIVATEUPLOADER] Worker crashed. Starting a new one, code: ${code}…`)

            cluster.fork()
        }
    })

    const restartWorker = async (worker: any, workers: any): Promise<void> => {
        await setEnvVariables()

        console.info(`[PRIVATEUPLOADER] Restarting worker ${worker.id}…`)

        await worker.kill("SIGUSR2")

        const newWorker = cluster.fork()

        newWorker.on("listening", (): void => {
            console.info(`[PRIVATEUPLOADER] Worker ${newWorker.id} is now listening.`)
        })
    }

    process.on("SIGUSR2", (): void => {
        const workers: string[] = Object.keys(cluster.workers || {})

        console.info("[PRIVATEUPLOADER] Workers: ", workers)
    })

    cluster.on("message", async (worker, message): Promise<void> => {
        console.info("message: ", message)

        if (message === "TPU_RESTART") {
            await setEnvVariables()

            console.info("[PRIVATEUPLOADER] Restarting workers…")

            const workers = Object.values(cluster.workers || {})

            if (workers.length > 0) {
                for (const worker of workers) {
                    await restartWorker(worker, workers)

                    // Wait 4 seconds
                    await new Promise((resolve) => setTimeout(resolve, 4000))
                }
            } else {
                console.info("[PRIVATEUPLOADER] No workers to restart.")
            }
        }
    })
} else import("./index")
