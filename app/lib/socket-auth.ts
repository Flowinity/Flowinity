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
        break
      }
      default: {
        scope = "user.view"
        break
      }
    }
    if (token) {
      const session = await this.userResolver.findByToken(token)
      if (!session) {
        socket.disconnect()
        throw new Error("Invalid token")
      } else if (checkScope(scope, session.scopes)) {
        if (!socket.request.user) socket.request.user = {}
        socket.request.user[namespace] = session.user
        socket.join(session.user.id)
        socket.emitWithAck("connected", namespace)
        next()
        return session
      } else {
        await socket.emitWithAck(
          "invalidScope",
          namespace ?? "/unknown",
          `Required scope: ${scope}, you have ${session.scopes}`
        )
        socket.disconnect()
        throw new Error("Invalid scope")
      }
    }
  }
}
