import {
  ConnectedSocket,
  OnConnect,
  SocketController
} from "socket-controllers"
import { Service } from "typedi"
import { SocketAuth } from "@app/types/socket"
import { SocketAuthMiddleware } from "@app/lib/socket-auth"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"

@SocketController("/autoCollects")
@Service()
export class AutoCollectsSocketController {
  constructor(private socketAuthMiddleware: SocketAuthMiddleware) {}

  @OnConnect()
  async onConnect(@ConnectedSocket() socket: SocketAuth) {
    const session = await this.socketAuthMiddleware.use(
      socket,
      () => {},
      SocketNamespaces.AUTO_COLLECTS
    )
    if (session) {
      socket.join(session.user.id)
    }
  }
}
