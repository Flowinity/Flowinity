import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage
} from "socket-controllers"
import { Service } from "typedi"
import { Socket } from "socket.io"
import { SocketAuth } from "@app/types/socket"
import {
  Pulse as PulseClass,
  SinglePulse
} from "@app/classes/socket/pulse/pulse"
import { Pulse } from "@app/models/pulse.model"
import { setDominateDevice } from "@app/lib/socket"

@SocketController("/pulse")
@Service()
export class PulseSocketController {
  @OnMessage("startPulse")
  async startPulse(
    @ConnectedSocket() socket: SocketAuth,
    @MessageBody() data: PulseClass
  ) {
    try {
      if (data.type === "gallery") {
        const pulse = await Pulse.create({
          userId: socket.request.user.id,
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
          userId: socket.request.user.id,
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
  }

  @OnMessage("pulse")
  async pulse(
    @ConnectedSocket() socket: SocketAuth,
    @MessageBody() data: SinglePulse
  ) {
    try {
      if (data.timeSpent > 3600000) return
      await Pulse.create({
        userId: socket.request.user.id,
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
      socket.emit("error", {
        message: "Error creating pulse."
      })
    }
  }

  @OnMessage("updatePulse")
  async updatePulse(
    @ConnectedSocket() socket: SocketAuth,
    @MessageBody() data: SinglePulse
  ) {
    try {
      const pulse: Pulse | null = await Pulse.findOne({
        where: {
          id: data.id,
          userId: socket.request.user.id
        }
      })

      if (pulse) {
        if (data.timeSpent < pulse.timeSpent) return
        if (data.timeSpent - pulse.timeSpent > 600000) return

        await pulse.update({
          timeSpent: data.timeSpent
        })
      }
    } catch {
      console.error("Error updating pulse.")
    }
  }
}
