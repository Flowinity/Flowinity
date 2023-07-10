import { Socket } from "socket.io"

// Import Models
import { User } from "@app/models/user.model"

export interface SocketAuth extends Socket {
  user: User
}
