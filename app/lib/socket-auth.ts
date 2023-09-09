import { Middleware, MiddlewareInterface } from "socket-controllers"
import { Socket } from "socket.io"
import { checkScope, Scope } from "@app/lib/auth"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { SocketAuth } from "@app/types/socket"
import { Service } from "typedi"

@Middleware()
@Service()
export class SocketAuthMiddleware implements MiddlewareInterface {
  constructor(private userResolver: UserResolver) {}

  //@ts-ignore
  use(socket: SocketAuth, next: (err?: any) => any) {
    socket.join(1)
    const nsp = socket.nsp
    const token = socket.handshake.auth.token
    let scope: Scope = "*"
    switch (nsp.name) {
      case "/chat": {
        scope = "chats.view"
        break
      }
      case "/user": {
        scope = "user.view"
        break
      }
      case "/pulse": {
        scope = "user.modify"
        break
      }
      case "/friend": {
        scope = "user.view"
      }
    }
    if (token) {
      this.userResolver.findByToken(token).then(async (session) => {
        if (!session) {
          socket.disconnect()
          throw new Error("Invalid token")
        } else if (checkScope(scope, session.scopes)) {
          socket.request.user = session.user
          socket.join("1")
          next()
        } else {
          await socket.emitWithAck("invalidScope", true, 1)
          socket.disconnect()
          throw new Error("Invalid scope")
        }
      })
    }
  }
}
