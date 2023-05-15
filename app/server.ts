import { Application } from "@app/app"
import * as http from "http"
import { AddressInfo } from "net"
import { Service } from "typedi"
import redis from "@app/redis"
import { caching } from "cache-manager"
import { CacheService } from "@app/services/cache.service"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import socket from "./lib/socket"
import { BillingService } from "@app/services/billing.service"
import { PulseService } from "@app/services/pulse.service"
import { BadgeService } from "@app/services/badge.service"
import cluster from "cluster"
import os from "os"
import ipPrimary from "@app/lib/whitelist/primary.json"
import { MyAnimeListService } from "@app/services/providers/mal.service"
import fs from "fs"
import path from "path"
import cryptoRandomString from "crypto-random-string"
import { DefaultTpuConfig } from "@app/classes/DefaultTpuConfig"

@Service()
export class Server {
  // This config will be replaced if it exists, if not, this will be used and will guide you through the setup process
  private config: TpuConfig = new DefaultTpuConfig().config
  private static readonly baseDix: number = 10
  private server: http.Server

  constructor(
    private readonly application: Application,
    private readonly cacheService: CacheService,
    private readonly billingService: BillingService,
    private readonly pulseService: PulseService,
    private readonly badgeService: BadgeService,
    private readonly malService: MyAnimeListService
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
    try {
      this.config = require(global.appRoot + "/config/tpu.json")
    } catch {}
    const cpuCount = os.cpus().length
    const mainWorker = !cluster.worker || cluster.worker?.id % cpuCount === 1

    this.application.app.set(
      "port",
      port || Server.normalizePort(this.config?.port || "34582")
    )
    this.application.app.set("trust proxy", 1)
    const memoryCache = await caching("memory")
    this.application.app.set("cache", memoryCache)
    // Dayjs extensions
    dayjs.extend(isoWeek)
    dayjs().isoWeek()
    dayjs().isoWeekday()
    dayjs().isoWeekYear()
    dayjs.extend(isSameOrBefore)
    global.db = require("@app/db")
    global.redis = redis
    global.config = this.config
    global.dayjs = dayjs
    global.whitelist = ipPrimary
    this.server = http.createServer(this.application.app)
    this.server.listen(
      port || Server.normalizePort(this.config?.port || "34582")
    )
    socket.init(this.application.app, this.server)
    this.server.on("error", (error: NodeJS.ErrnoException) =>
      this.onError(error)
    )
    process.on("uncaughtException", function (err, origin) {
      console.log(origin)
      console.warn(err)
    })
    this.server.on("listening", () => this.onListening())
    if (mainWorker) {
      this.cacheService.cacheInit()
      this.billingService.billingInit()
      this.pulseService.pulseInit()
      this.badgeService.badgeInit()
      this.malService.providerInit()
    } else {
      console.log("Background tasks not started due to non-primary worker")
    }
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
      throw error
    }
    const port = Server.normalizePort(this.config?.port || "34582")
    const bind: string =
      typeof port === "string" ? "Pipe " + port : "Port " + port
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case "EADDRINUSE":
        if (this.config?.release === "dev") {
          const port = parseInt(process.env.PORT || "34582", 10) + 1
          this.init(port)
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

  // When the Express server starts listening on the port
  private onListening(): void {
    const addr = this.server.address() as AddressInfo
    const bind: string = `port ${addr.port}`
    // eslint-disable-next-line no-console
    console.log(`Listening on ${bind}`)
  }
}
