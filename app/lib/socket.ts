import { Container } from "typedi"
import { createAdapter } from "@socket.io/redis-adapter"

// Import Libs
import auth from "@app/lib/authSocket"

// Import Services
import { UserUtilsService } from "@app/services/userUtils.service"

// Import Models
import { User } from "@app/models/user.model"

// Import Types
import { SocketAuth } from "@app/types/socket"
import setupV4Socket from "@app/lib/socket-v3"
import setupV3Socket from "@app/lib/socket-v3"
import { redisHandleError } from "@app/lib/redisHandleError"

interface Platform {
  platform: string
  id: string
  lastSeen: String
  status: string
}

export async function setDominateDevice(
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
    if (!config.finishedSetup || config.redis.host === "defaulthostname") return
    const subClient = redis.duplicate()
    const io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
      }
    })

    try {
      await subClient.connect()
    } catch (e) {
      redisHandleError(e)
    }
    io.adapter(createAdapter(redis, subClient))
    io.use(auth)
    io.on("connection", async (socket: SocketAuth): Promise<void> => {
      const user: User | null = await User.findOne({
        where: {
          id: socket.user.id
        }
      })

      if (user && socket.user.id) {
        switch (socket.handshake.query.version) {
          case "4": {
            await setupV4Socket(socket, user, io)
            break
          }
          default: {
            await setupV3Socket(socket, user, io)
            break
          }
        }
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
