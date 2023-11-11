import * as http from "http"
import { AddressInfo } from "net"
import { Container, Service } from "typedi"
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
import { SocketControllers } from "socket-controllers"
import { ChatSocketController } from "@app/controllers/socket/chat.socket"
import createSocket from "@app/lib/socket-next"
import { SocketAuthMiddleware } from "@app/lib/socket-auth"
import { PulseSocketController } from "@app/controllers/socket/pulse.socket"
import { UserSocketController } from "@app/controllers/socket/user.socket"
import { FriendsSocketController } from "@app/controllers/socket/friends.socket"
import { GallerySocketController } from "@app/controllers/socket/gallery.socket"
import { AutoCollectsSocketController } from "@app/controllers/socket/autoCollects.socket"
import { TrackedUserSocketController } from "@app/controllers/socket/tracked.socket"
import { Server as SocketServer } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { SocketServerWithUser } from "./types/global"
@Service({ eager: false })
export class Server {
  private static readonly baseDix: number = 10
  // This config will be replaced if it exists, if not, this will be used and will guide you through the setup process
  private config: TpuConfig = process.env.CONFIG
    ? JSON.parse(process.env.CONFIG || "{}")
    : new DefaultTpuConfig().config
  public server: http.Server
  public socket: SocketServer | undefined
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

  async startSocket() {
    if (!this.server) this.server = http.createServer(this.application.app)
    this.socket = await createSocket(this.application.app, this.server)
    global.socket = this.socket as unknown as SocketServerWithUser
    new SocketControllers({
      // @ts-ignore
      io: socket,
      container: Container,
      middlewares: [SocketAuthMiddleware],
      controllers: [
        ChatSocketController,
        PulseSocketController,
        UserSocketController,
        FriendsSocketController,
        GallerySocketController,
        AutoCollectsSocketController,
        TrackedUserSocketController
      ]
    })
  }

  async init(port?: number, noBackgroundTasks = false): Promise<void> {
    const cpuCount: number = os.cpus().length
    const mainWorker: boolean =
      !cluster.worker || cluster.worker?.id % cpuCount === 1
    global.mainWorker = mainWorker

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
    global.db = require("@app/db").default
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
    await this.startSocket()
    if (!noBackgroundTasks) {
      this.server.listen(
        port || Server.normalizePort(this.config?.port || "34582")
      )
    }

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

    if (mainWorker && !noBackgroundTasks) {
      await this.cacheService.cacheInit()
      await this.billingService.billingInit()
      await this.pulseService.pulseInit()
      await this.badgeService.badgeInit()
      await this.malService.providerInit()
      await this.discordService.providerInit()
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
