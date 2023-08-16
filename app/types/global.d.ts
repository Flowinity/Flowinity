import { Socket } from "socket.io"
import djs from "dayjs"
import { RedisClientType } from "redis"
import { Sequelize } from "sequelize-typescript"

// @ts-ignore
export interface SocketWithUser extends Socket {
  to(room: string | number | string[] | number[]): SocketWithUser
}

declare global {
  var redis: any,
    db: Sequelize,
    config: TpuConfig,
    dayjs: typeof djs,
    socket: SocketWithUser,
    whitelist: { ip: string; name: string; groups: string[] }[],
    appRoot: string,
    rawAppRoot: string,
    queue: typeof import("@app/lib/queue").default,
    domain: string | undefined,
    authMock: any,
    mainWorker: boolean,
    storageRoot: string
}

export {}
