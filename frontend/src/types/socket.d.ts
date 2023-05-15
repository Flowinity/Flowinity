import {Socket} from "socket.io"
import {User} from "@/models/user"

export interface SocketAuth extends Socket {
  user: User;
}
