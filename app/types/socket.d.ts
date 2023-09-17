import { Request } from "socket.io"
import { User } from "@app/models/user.model"
import { SocketWithUser } from "@app/types/global"

export interface SocketAuth extends SocketWithUser {
  user: User
  request: Request & { user: User }
}
