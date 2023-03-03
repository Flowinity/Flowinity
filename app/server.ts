import { Application } from "@app/app"
import * as http from "http"
import { AddressInfo } from "net"
import { Service } from "typedi"
import sequelize from "@app/db"
import redis from "@app/redis"
import { caching } from "cache-manager"
import config from "@app/config/tpu.json"
import { CacheService } from "@app/services/cache.service"
import dayjs from "dayjs"
import socket from "./lib/socket"
import { BillingService } from "@app/services/billing.service"

@Service()
export class Server {
  private static readonly appPort: string | number | boolean =
    Server.normalizePort(process.env.PORT || "34582")
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  private static readonly baseDix: number = 10
  private server: http.Server

  constructor(
    private readonly application: Application,
    private readonly cacheService: CacheService,
    private readonly billingService: BillingService
  ) {}

  private static normalizePort(
    val: number | string
  ): number | string | boolean {
    const port: number =
      typeof val === "string" ? parseInt(val, this.baseDix) : val
    if (isNaN(port)) {
      return val
    } else if (port >= 0) {
      return port
    } else {
      return false
    }
  }

  async init(port?: number): Promise<void> {
    this.application.app.set("port", port || Server.appPort)
    this.application.app.set("trust proxy", 1)
    const memoryCache = await caching("memory")
    this.application.app.set("cache", memoryCache)
    global.db = sequelize
    global.redis = redis
    global.config = config
    global.dayjs = dayjs
    this.billingService.billingInit()
    this.cacheService.cacheInit()
    this.server = http.createServer(this.application.app)

    this.server.listen(port || Server.appPort)
    socket.init(this.application.app, this.server)
    this.server.on("error", (error: NodeJS.ErrnoException) =>
      this.onError(error)
    )
    process.on("uncaughtException", function (err, origin) {
      console.log(origin)
      console.warn(err)
    })
    this.server.on("listening", () => this.onListening())
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
      throw error
    }
    const bind: string =
      typeof Server.appPort === "string"
        ? "Pipe " + Server.appPort
        : "Port " + Server.appPort
    switch (error.code) {
      case "EACCES":
        // eslint-disable-next-line no-console
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case "EADDRINUSE":
        if (process.env.PROD_DEBUG === "true") {
          const port = 34583
          this.init(port)
          return
        }
        // eslint-disable-next-line no-console
        console.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  }

  /**
   * Se produit lorsque le serveur se met à écouter sur le port.
   */
  private onListening(): void {
    const addr = this.server.address() as AddressInfo
    const bind: string = `port ${addr.port}`
    // eslint-disable-next-line no-console
    console.log(`Listening on ${bind}`)
  }
}
