import * as http from "http"
import { AddressInfo } from "net"
import { Container, Service } from "typedi"
import { MemoryCache, caching } from "cache-manager"
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
import { SocketServerWithUser } from "./types/global"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import generateContext from "@app/classes/graphql/middleware/generateContext"
import { UserStatus, UserStoredStatus } from "@app/classes/graphql/user/status"
import { User } from "./models/user.model"
import { UserUtilsService } from "@app/services/userUtils.service"
import { Platform, PlatformType } from "@app/classes/graphql/user/platforms"
import cryptoRandomString from "crypto-random-string"
import { randomUUID } from "crypto"
import { GqlError } from "@app/lib/gqlErrors"

@Service({ eager: false })
export class Server {
  private static readonly baseDix: number = 10
  // This config will be replaced if it exists, if not, this will be used and will guide you through the setup process
  private config: TpuConfig = process.env.CONFIG
    ? JSON.parse(process.env.CONFIG || "{}")
    : new DefaultTpuConfig().config
  public server: http.Server
  public legacyServer: http.Server
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

    if (isNaN(port)) {
      return val
    } else if (port >= 0) {
      return port
    }
    return false
  }

  async startSocket() {
    if (!this.server) {
      this.server = http.createServer(this.application.app)
    }
    this.socket = await createSocket(this.application.app, this.legacyServer)
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

    const wsServer = new WebSocketServer({
      server: this.server,
      path: "/graphql"
    })

    useServer(
      {
        execute: (args: any) => args.rootValue.execute(args),
        subscribe: (args: any) => args.rootValue.subscribe(args),
        onConnect: async (ctx) => {
          if (!ctx.extra) {
            //@ts-ignore
            ctx.extra = {}
          }
          //@ts-ignore
          ctx.extra.resumableState = ctx?.connectionParams?.[
            "x-tpu-resumable-state-id"
          ] as string | undefined
          //@ts-ignore
          const id = randomUUID()
          if (
            !ctx?.extra?.resumableState ||
            typeof ctx?.extra?.resumableState !== "string" ||
            // @ts-ignore
            !ctx?.extra?.resumableState?.match(
              /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            )
          ) {
            throw new GqlError("INVALID_RESUMABLE_STATE_KEY")
          }
          const newCtx = await generateContext(ctx)
          if (
            newCtx.user &&
            newCtx.user.storedStatus !== UserStoredStatus.INVISIBLE
          ) {
            await User.update(
              {
                status: newCtx.user.storedStatus
              },
              {
                where: {
                  id: newCtx.user.id
                }
              }
            )

            const userService: UserUtilsService =
              Container.get(UserUtilsService)
            let devices = (await redis.json.get(
              `user:${newCtx.user.id}:platforms`
            )) as unknown as Platform[] | undefined
            if (!devices) {
              devices = []
            }
            let platform: PlatformType
            switch (ctx?.connectionParams?.["x-tpu-client"]) {
              case "android_kotlin":
                platform = PlatformType.MOBILE
                break
              case "TPUv5 (Flowinity)":
              case "Flowinity5":
              case "TPUvNEXT":
                platform = PlatformType.WEB
                break
              default:
                platform = PlatformType.WEB
            }
            if (devices.length > 3) {
              devices.pop()
            }
            devices.unshift({
              platform,
              lastSeen: new Date().toISOString(),
              status: newCtx.user.storedStatus as unknown as UserStatus,
              id
            })
            await redis.json.set(
              `user:${newCtx.user.id}:platforms`,
              "$",
              devices as any
            )

            userService.emitToTrackedUsers(
              newCtx.user.id,
              "userStatus",
              {
                id: newCtx.user.id,
                status: newCtx.user.storedStatus.toUpperCase(),
                platforms: devices
              },
              true
            )
          }
          //@ts-ignore
          ctx.extra.id = id
          //@ts-ignore
          ctx.extra.userId = newCtx.user?.id
          return {
            ...ctx,
            id,
            resumableState: ctx.extra.resumableState
          }
        },
        onDisconnect: async (ctx, code) => {
          // Get error code
          console.log(ctx.extra.userId, "DISCONNECTED")
          if (code !== 1000) {
          }
          if (ctx.extra.userId) {
            let clients = (await redis.json.get(
              `user:${ctx.extra.userId}:platforms`
            )) as unknown as Platform[] | undefined
            if (clients) {
              clients = clients.filter(
                (client: any) => client.id !== ctx.extra.id
              )
              if (clients.length === 0) {
                await User.update(
                  {
                    status: UserStatus.OFFLINE
                  },
                  {
                    where: {
                      id: ctx.extra.userId
                    }
                  }
                )
                const userService: UserUtilsService =
                  Container.get(UserUtilsService)
                userService.emitToTrackedUsers(
                  ctx.extra.userId,
                  "userStatus",
                  {
                    id: ctx.extra.userId,
                    status: UserStatus.OFFLINE.toUpperCase(),
                    platforms: clients
                  },
                  true
                )
              }
              await redis.json.set(
                `user:${ctx.extra.userId}:platforms`,
                "$",
                clients as any
              )
            }
          }
        },
        onSubscribe: async (ctx, msg) => {
          const {
              schema,
              execute,
              subscribe,
              contextFactory,
              parse,
              validate
            } = this.application.yogaApp.getEnveloped({
              ...ctx,
              ...(await generateContext(ctx)),
              req: ctx.extra.request,
              socket: ctx.extra.socket,
              params: msg.payload
            }),
            args = {
              schema,
              operationName: msg.payload.operationName,
              document: parse(msg.payload.query),
              variableValues: msg.payload.variables,
              contextValue: await contextFactory(),
              rootValue: {
                execute,
                subscribe
              }
            },
            errors = validate(args.schema, args.document)
          if (errors.length) {
            return errors
          }
          return args
        },
        onNext: async (ctx, msg, args) => {}
      },
      wsServer
    )
  }

  async init(port?: number, noBackgroundTasks = false): Promise<void> {
    const cpuCount: number = os.cpus().length,
      mainWorker: boolean =
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
    if (config.finishedSetup) {
      global.redis = redis
      global.queue = require("@app/lib/queue").default
      global.domain = await Domain.findOne({
        where: { id: 1 }
      }).then((domain: Domain | null) => {
        if (domain) {
          return domain.domain
        }
        return undefined
      })
    }
    global.config = this.config
    global.appRoot = process.env.APP_ROOT || ""
    global.rawAppRoot = process.env.RAW_APP_ROOT || ""
    global.dayjs = dayjs
    global.whitelist = ipPrimary
    this.server = http.createServer(this.application.yogaApp)
    this.legacyServer = http.createServer(this.application.app)
    await this.startSocket()
    if (!noBackgroundTasks) {
      this.legacyServer.listen(
        port || Server.normalizePort(this.config?.port || "34582")
      )
      this.server.listen(34583)
    }

    this.server.on("error", (error: NodeJS.ErrnoException) =>
      this.onError(error)
    )

    this.legacyServer.on("error", (error: NodeJS.ErrnoException) =>
      this.onError(error)
    )

    process.on(
      "uncaughtException",
      (err: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
        console.log(origin)
        console.warn(err)
      }
    )

    this.server.on("listening", () => this.onListening())
    this.legacyServer.on("listening", () => this.onLegacyListening())

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
    if (error.syscall !== "listen") {
      throw error
    }

    const port: string | number | boolean = Server.normalizePort(
        this.config?.port || "34582"
      ),
      bind: string = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`

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
    const addr: AddressInfo = this.server.address() as AddressInfo,
      bind: string = `port ${addr.port}`

    // eslint-disable-next-line no-console
    console.log(`[SERVER_V5] Listening on ${bind}`)
  }

  private onLegacyListening(): void {
    const addr: AddressInfo = this.legacyServer.address() as AddressInfo,
      bind: string = `port ${addr.port}`

    // eslint-disable-next-line no-console
    console.log(`[SERVER_LEGACY] Listening on ${bind}`)
  }
}
