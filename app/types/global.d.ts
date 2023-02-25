import { Socket } from "socket.io"

// @ts-ignore
export interface SocketWithUser extends Socket {
  to(room: string | number | string[] | number[]): SocketWithUser
}

declare global {
  var redis: any, db: any, config: TpuConfig, dayjs: any, socket: SocketWithUser
}

export {}
