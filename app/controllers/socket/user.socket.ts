import {
  ConnectedSocket,
  OnConnect,
  OnDisconnect,
  SocketController
} from "socket-controllers"
import { Service } from "typedi"
import { SocketAuth } from "@app/types/socket"
import { SocketAuthMiddleware } from "@app/lib/socket-auth"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { User } from "@app/models/user.model"
import { UserUtilsService } from "@app/services/userUtils.service"

@SocketController("/user")
@Service()
export class UserSocketController {
  constructor(
    private socketAuthMiddleware: SocketAuthMiddleware,
    private userService: UserUtilsService
  ) {}

  @OnConnect()
  async onConnect(@ConnectedSocket() socket: SocketAuth) {
    const session = await this.socketAuthMiddleware.use(
      socket,
      () => {},
      SocketNamespaces.USER
    )
    if (session) {
      socket.join(session.user.id)
      const user = session.user
      if (user.storedStatus === "invisible") return
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
        await this.userService.emitToTrackedUsers(user.id, "userStatus", {
          id: user.id,
          status: user.storedStatus.toUpperCase(),
          // TODO: Platform presence
          platforms: []
        })
      }
    }
  }

  @OnDisconnect()
  async onDisconnect(@ConnectedSocket() socket: SocketAuth) {
    const session = await this.socketAuthMiddleware.use(
      socket,
      () => {},
      SocketNamespaces.USER
    )

    if (session) {
      const user = session.user
      if (user.storedStatus === "invisible") return
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
      await this.userService.emitToTrackedUsers(user.id, "userStatus", {
        id: user.id,
        status: "OFFLINE",
        // TODO: Platform presence
        platforms: []
      })
    }
  }
}
