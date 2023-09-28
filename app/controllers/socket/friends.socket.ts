import {
  ConnectedSocket,
  OnConnect,
  SocketController
} from "socket-controllers"
import { Service } from "typedi"
import { SocketAuth } from "@app/types/socket"
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
