import { Request } from "socket.io"
import { User } from "@app/models/user.model"
import { SocketWithUser } from "@app/types/global"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"

export interface SocketAuth extends SocketWithUser {
  user: User
  request: Request & { user: Record<SocketNamespaces, User> }
}
