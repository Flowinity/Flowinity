import { SocketAuth } from "@app/types/socket"
import { User } from "@app/models/user.model"
import { Pulse } from "@app/models/pulse.model"

import auth from "@app/lib/authSocket"

export default {
  init(app: any, server: any) {
    const io = require("socket.io")(server, {
      cors: {
        origin: [config.hostnameWithProtocol],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
      }
    })
    io.use(auth)
    io.on("connection", async (socket: SocketAuth) => {
      const user = await User.findOne({
        where: {
          id: socket.user.id
        }
      })
      if (user && socket.user.id) {
        socket.join(user.id)
        if (user.storedStatus !== "invisible") {
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
        // on disconnect
        socket.on("disconnect", async () => {
          // ensure all sockets are disconnected
          const sockets = await io.in(user.id).allSockets()
          if (sockets.size === 0) {
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
              const pulse = await Pulse.create({
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
              const pulse = await Pulse.create({
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
          } catch (e) {
            console.log(e)
            console.log("error creating pulse")
          }
        })
        socket.on("updatePulse", async (data) => {
          try {
            const pulse = await Pulse.findOne({
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
            console.log("error updating pulse")
          }
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
        console.log("Unauthenticated user")
        socket.on("reAuth", async () => {
          socket.disconnect()
        })
      }
    })
    app.set("io", io)
    global.socket = io
    console.log("WS OK")
  }
}
