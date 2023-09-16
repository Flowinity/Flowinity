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
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { SocketAuthMiddleware } from "@app/lib/socket-auth"

@SocketController("/friends")
@Service()
export class FriendsSocketController {
  constructor(private socketAuthMiddleware: SocketAuthMiddleware) {}

  @OnConnect()
  async onConnect(@ConnectedSocket() socket: SocketAuth) {
    const session = await this.socketAuthMiddleware.use(
      socket,
      () => {},
      SocketNamespaces.FRIENDS
    )
    if (session) {
      socket.join(session.user.id)
    }
  }
}
