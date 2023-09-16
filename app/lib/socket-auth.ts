import { Middleware, MiddlewareInterface } from "socket-controllers"
import { checkScope, Scope } from "@app/lib/auth"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { SocketAuth } from "@app/types/socket"
import { Service } from "typedi"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"

@Middleware()
@Service()
export class SocketAuthMiddleware implements MiddlewareInterface {
  constructor(private userResolver: UserResolver) {}

  //@ts-ignore
  async use(
    socket: SocketAuth,
    next: (err?: any) => any,
    namespace: SocketNamespaces
  ) {
    const token = socket.handshake.auth.token
    let scope: Scope = "*"
    switch (namespace) {
      case SocketNamespaces.CHAT: {
        scope = "chats.view"
        break
      }
      case SocketNamespaces.USER: {
        scope = "user.view"
        break
      }
      case SocketNamespaces.PULSE: {
        scope = "user.modify"
        break
      }
      case SocketNamespaces.FRIENDS: {
        scope = "user.view"
        break
      }
      case SocketNamespaces.AUTO_COLLECTS: {
        scope = "collections.view"
        break
      }
      case SocketNamespaces.GALLERY: {
        scope = "uploads.view"
        break
      }
      case SocketNamespaces.TRACKED_USERS: {
        scope = "user.view"
      }
    }
    if (token) {
      const session = await this.userResolver.findByToken(token)

      if (!session) {
        socket.disconnect()
        throw new Error("Invalid token")
      } else if (checkScope(scope, session.scopes)) {
        socket.request.user = session.user
        socket.join(session.user.id)
        next()
        return session
      } else {
        await socket.emitWithAck("invalidScope", true, 1)
        socket.disconnect()
        throw new Error("Invalid scope")
      }
    }
  }
}
