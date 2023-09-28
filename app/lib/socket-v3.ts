import cryptoRandomString from "crypto-random-string"
import { UserUtilsService } from "@app/services/userUtils.service"
import { Container } from "typedi"
import { User } from "@app/models/user.model"
import { Pulse } from "@app/models/pulse.model"
import { ChatService } from "@app/services/chat.service"
import { Platform } from "@app/classes/graphql/user/platforms"
import { SocketAuth } from "@app/types/socket"
import { setDominateDevice } from "@app/lib/socket"

export default async function setupV3Socket(
  socket: SocketAuth,
  user: User,
  io: any
) {
  socket.join(user.id)
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
}
