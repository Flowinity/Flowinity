import { Container } from "typedi"

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

export default {
  async init() {
    const io = require("socket.io")()

    io.use(auth)
    io.on("connection", async (socket: SocketAuth) => {
      const user: User | null = await User.findOne({
        where: {
          id: socket.user.id
        }
      })

      if (user && socket.user.id) {
        socket.join(user.id)

        if (
          user.storedStatus !== "invisible" &&
          user.status !== user.storedStatus
        ) {
          console.info(`user ${user.username} going online`)

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

          const userService: UserUtilsService = Container.get(UserUtilsService)

          await userService.emitToFriends(user.id, "userStatus", {
            id: user.id,
            status: user.storedStatus
          })
        }

        socket.on("disconnect", async () => {
          // Ensure that all sockets are disconnected.
          const sockets = await io.in(user.id).allSockets()

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
            }
          }
        })
        socket.emit("pulseConfig", {
          interval: 10000
        })
        socket.on("pulse", async (data) => {
          try {
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
        socket.on("startPulse", async (data) => {
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
        socket.on("updatePulse", async (data) => {
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

        socket.on("readChat", async (associationId: number) => {
          const chatService: ChatService = Container.get(ChatService)
          await chatService.readChat(associationId, user.id)
        })
        socket.on("typing", async (associationId: number) => {
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
        socket.on("token", async () => {
          socket.emit("unsupported", {
            message: "This authentication method is unsupported."
          })
        })

        console.info("Unauthenticated user")

        socket.on("reAuth", async () => {
          socket.disconnect()
        })
      }
    })

    global.socket = io
  }
}
