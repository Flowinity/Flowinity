import * as http from "http"
import { AddressInfo } from "net"
import { Service } from "typedi"
import { caching, MemoryCache } from "cache-manager"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import cluster from "cluster"
import os from "os"

// Import Miscellaneous
import { Application } from "@app/app"
import redis from "@app/redis"

// Import Libs
import socket from "@app/lib/socket"
import ipPrimary from "@app/lib/whitelist/primary.json"

// Import Classes
import { DefaultTpuConfig } from "@app/classes/DefaultTpuConfig"

// Import Services
import { CacheService } from "@app/services/cache.service"
import { OfficialInstJolt707 } from "@app/services/officialInst.jolt707"
import { PulseService } from "@app/services/pulse.service"
import { OfficialInstBadge } from "@app/services/officialInst.badge"
import { MyAnimeListService } from "@app/services/providers/mal.service"
import { DiscordService } from "@app/services/providers/discord.service"

// Import Models
import { Domain } from "@app/models/domain.model"

@Service({ eager: false })
export class Server {
  private static readonly baseDix: number = 10
  // This config will be replaced if it exists, if not, this will be used and will guide you through the setup process
  private config: TpuConfig = process.env.CONFIG
    ? JSON.parse(process.env.CONFIG || "{}")
    : new DefaultTpuConfig().config
  private server: http.Server
  public readonly ready: any
  constructor(
    private readonly application: Application,
    private readonly cacheService: CacheService,
    private readonly billingService: OfficialInstJolt707,
    private readonly pulseService: PulseService,
    private readonly badgeService: OfficialInstBadge,
    private readonly malService: MyAnimeListService,
    private readonly discordService: DiscordService
  ) {}

  private static normalizePort(
    val: number | string
  ): number | string | boolean {
    const port: number =
      typeof val === "string" ? parseInt(val, this.baseDix) : val

    if (isNaN(port)) return val
    else if (port >= 0) return port
    else return false
  }

  async init(port?: number): Promise<void> {
    const cpuCount: number = os.cpus().length
    const mainWorker: boolean =
      !cluster.worker || cluster.worker?.id % cpuCount === 1

    this.application.app.set(
      "port",
      port || Server.normalizePort(this.config?.port || "34582")
    )
    this.application.app.set("trust proxy", 1)

    const memoryCache: MemoryCache = await caching("memory")

    this.application.app.set("cache", memoryCache)

    // Dayjs Extensions
    dayjs.extend(isoWeek)
    dayjs().isoWeek()
    dayjs().isoWeekday()
    dayjs().isoWeekYear()
    dayjs.extend(isSameOrBefore)

    global.db = require("@app/db")
    if (config.finishedSetup) {
      global.redis = redis
      global.queue = require("@app/lib/queue").default
      global.domain = await Domain.findOne({
        where: { id: 1 }
      }).then((domain: Domain | null) => {
        if (domain) return domain.domain
        else return undefined
      })
    }
    global.config = this.config
    global.appRoot = process.env.APP_ROOT || ""
    global.rawAppRoot = process.env.RAW_APP_ROOT || ""
    global.dayjs = dayjs
    global.whitelist = ipPrimary
    this.server = http.createServer(this.application.app)
    this.server.listen(
      port || Server.normalizePort(this.config?.port || "34582")
    )

    await socket.init(this.application.app, this.server)

    this.server.on("error", (error: NodeJS.ErrnoException) =>
      this.onError(error)
    )

    process.on(
      "uncaughtException",
      function (err: Error, origin: NodeJS.UncaughtExceptionOrigin) {
        console.log(origin)
        console.warn(err)
      }
    )

    this.server.on("listening", () => this.onListening())

    if (mainWorker) {
      await this.discordService.providerInit()
      await this.cacheService.cacheInit()
      await this.billingService.billingInit()
      await this.pulseService.pulseInit()
      await this.badgeService.badgeInit()
      await this.malService.providerInit()
    } else {
      console.log("Background tasks not started due to non-primary worker.")
    }
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") throw error

    const port: string | number | boolean = Server.normalizePort(
      this.config?.port || "34582"
    )
    const bind: string =
      typeof port === "string" ? "Pipe " + port : "Port " + port

    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`)

        process.exit(1)
        break
      case "EADDRINUSE":
        if (this.config?.release === "dev") {
          const port: number = parseInt(process.env.PORT || "34582", 10) + 1

          this.init(port).then((): void => {
            console.log(`Listening on ${port}`)
          })

          return
        }

        console.error(`${bind} is already in use`)

        process.exit(1)
        break
      case "ENOENT":
        break
      default:
        throw error
    }
  }

  // When the Express.JS server starts listening on the port
  private onListening(): void {
    const addr: AddressInfo = this.server.address() as AddressInfo
    const bind: string = `port ${addr.port}`

    // eslint-disable-next-line no-console
    console.log(`Listening on ${bind}`)
  }
}
