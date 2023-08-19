import { Container } from "typedi"
import { createAdapter } from "@socket.io/redis-adapter"

// Import Libs
import auth from "@app/lib/authSocket"

// Import Services
import { UserUtilsService } from "@app/services/userUtils.service"
import { ChatService } from "@app/services/chat.service"

// Import Models
import { User } from "@app/models/user.model"
import { Pulse } from "@app/models/pulse.model"

// Import Types
import { SocketAuth } from "@app/types/socket"
import cryptoRandomString from "crypto-random-string"

interface Platform {
  platform: string
  id: string
  lastSeen: String
  status: string
}

async function setDominateDevice(
  userId: number,
  platform: Platform,
  storedStatus: string
) {
  let status = await redis.json.get(`user:${userId}:platforms`)
  // move the dominate device to the top of the list
  if (!status?.length || status[0].id === platform.id) return
  status = status.filter((p: Platform) => p.platform !== platform.platform)
  status.unshift(platform)
  redis.json.set(`user:${userId}:platforms`, "$", status)
  const userService: UserUtilsService = Container.get(UserUtilsService)
  if (storedStatus === "invisible") return
  await userService.emitToFriends(userId, "userStatus", {
    id: userId,
    storedStatus,
    platforms: status
  })
}

export default {
  async init(app: any, server: any): Promise<void> {
    if (!config.finishedSetup) return
    const subClient = redis.duplicate()
    const io = require("socket.io")(server, {
      cors: {
        origin: [config.hostnameWithProtocol],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
      }
    })

    await subClient.connect()

    io.adapter(createAdapter(redis, subClient))
    io.use(auth)
    io.on("connection", async (socket: SocketAuth): Promise<void> => {
      const user: User | null = await User.findOne({
        where: {
          id: socket.user.id
        }
      })

      if (user && socket.user.id) {
        socket.join(user.id.toString())
        const platform = socket.handshake.query.platform || "web"
        const device = {
          platform: platform,
          lastSeen: new Date().toISOString(),
          status: user?.storedStatus,
          id: cryptoRandomString({ length: 16 })
        } as Platform
        if (user.storedStatus !== "invisible") {
          console.info(`user ${user.username} going online`)
          let status = await redis.json.get(`user:${user.id}:platforms`)
          if (["android_kotlin", "web", "desktop"].includes(<string>platform)) {
            const sockets = await io.in(user.id).allSockets()
            if (sockets.size < status?.length || !status) {
              status = []
            }
            console.log(device, status)
            status.unshift(device)
            redis.json.set(`user:${user.id}:platforms`, "$", status)
          }
          const userService: UserUtilsService = Container.get(UserUtilsService)
          await userService.emitToFriends(user.id, "userStatus", {
            id: user.id,
            status: user.storedStatus,
            platforms: status
          })

          if (user.status !== user.storedStatus) {
            await User.update(
              {
                status: user.storedStatus
              },
              {
                where: {
                  id: user.id
                }
              }
            )
          }
        }

        socket.on("disconnect", async (): Promise<void> => {
          let status = await redis.json.get(`user:${user.id}:platforms`)
          if (status?.length) {
            status = status.filter((p: any) => p.id !== device.id)
            redis.json.set(`user:${user.id}:platforms`, "$", status)
          }
          // Ensure that all sockets are disconnected.
          const sockets = await io.in(user.id).allSockets()
          const userService: UserUtilsService = Container.get(UserUtilsService)
          if (sockets.size === 0) {
            console.info(`user ${user.username} going offline`)
            if (user.storedStatus !== "invisible") {
              await User.update(
                {
                  status: "offline"
                },
                {
                  where: {
                    id: user.id
                  }
                }
              )
              await userService.emitToFriends(user.id, "userStatus", {
                id: user.id,
                status: "offline",
                platforms: status
              })
            }
          } else if (user.storedStatus !== "invisible") {
            await userService.emitToFriends(user.id, "userStatus", {
              id: user.id,
              status: user.storedStatus,
              platforms: status
            })
          }
        })
        socket.emit("pulseConfig", {
          interval: 10000
        })
        socket.on("pulse", async (data): Promise<void> => {
          try {
            setDominateDevice(user.id, device, user.storedStatus)
            if (data.timeSpent > 3600000) return
            await Pulse.create({
              userId: user.id,
              action: data.action,
              route: data.route,
              timeSpent: data.timeSpent || 0,
              device: data.device,
              sysInfo: data.sysInfo,
              name: data.name,
              other: data.other
            })
          } catch {
            console.log("error creating pulse")
          }
        })
        socket.on("startPulse", async (data): Promise<void> => {
          try {
            if (data.type === "gallery") {
              const pulse: Pulse = await Pulse.create({
                userId: user.id,
                action: "focus",
                route: "/gallery",
                timeSpent: 0,
                device: data.device,
                sysInfo: data.sysInfo,
                name: data.name,
                other: data.other
              })

              socket.emit("pulseToken-" + data.id, {
                id: pulse.id
              })
            } else if (data.type === "global") {
              const pulse: Pulse = await Pulse.create({
                userId: user.id,
                action: "focus",
                route: data.route,
                timeSpent: 0,
                device: data.device,
                sysInfo: data.sysInfo,
                name: data.name,
                other: data.other
              })

              socket.emit("pulseToken-" + data.id, {
                id: pulse.id
              })
            }
          } catch (err) {
            console.error(err)
            console.error("Error creating pulse.")
          }
        })
        socket.on("updatePulse", async (data): Promise<void> => {
          try {
            const pulse: Pulse | null = await Pulse.findOne({
              where: {
                id: data.id,
                userId: user.id
              }
            })

            if (pulse) {
              if (data.timeSpent < pulse.timeSpent) return
              if (data.timeSpent - pulse.timeSpent > 600000) return

              await pulse.update({
                timeSpent: data.timeOnPage
              })
            }
          } catch {
            console.error("Error updating pulse.")
          }
        })

        // Chat
        let typeRateLimit: Date | null = null as Date | null

        socket.on("readChat", async (associationId: number): Promise<void> => {
          const chatService: ChatService = Container.get(ChatService)
          await chatService.readChat(associationId, user.id)
        })
        socket.on("typing", async (associationId: number): Promise<void> => {
          if (
            typeRateLimit &&
            dayjs().isBefore(dayjs(typeRateLimit).add(2, "second"))
          )
            return

          const chatService: ChatService = Container.get(ChatService)

          await chatService.typing(associationId, user.id)

          typeRateLimit = new Date()
        })
      } else {
        socket.join("-1")
        socket.emit("unauthorized", {
          message: "Please reauth."
        })
        socket.on("token", async (): Promise<void> => {
          socket.emit("unsupported", {
            message: "This authentication method is unsupported."
          })
        })

        console.info("Unauthenticated user")

        socket.on("reAuth", async (): Promise<void> => {
          socket.disconnect()
        })
      }

      socket.on("echo", async (data) => {
        console.log(data)
        socket.emit("echo", data)
      })
    })

    app.set("io", io)

    global.socket = io

    console.info("WS OK")
  }
}
