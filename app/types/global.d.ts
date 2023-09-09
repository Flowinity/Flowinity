import { Server, Socket } from "socket.io"
import djs from "dayjs"
import { RedisClientType } from "redis"
import { Sequelize } from "sequelize-typescript"
import { Cache } from "@envelop/response-cache"
import { PubSub } from "graphql-yoga"
import { PubSubEngine } from "type-graphql"

// @ts-ignore
export interface SocketWithUser extends Socket {
  to(room: string | number | string[] | number[]): SocketWithUser
  join(rooms: string | string[] | number | number[]): SocketWithUser
}

export interface SocketServerWithUser extends Server {
  to(room: string | number | string[] | number[]): SocketServerWithUser
  join(rooms: string | string[] | number | number[]): SocketServerWithUser
  of(namespace: string): Server.Namespace
}

declare global {
  var redis: any,
    db: Sequelize,
    config: TpuConfig,
    dayjs: typeof djs,
    socket: SocketServerWithUser,
    whitelist: { ip: string; name: string; groups: string[] }[],
    appRoot: string,
    rawAppRoot: string,
    queue: typeof import("@app/lib/queue").default,
    domain: string | undefined,
    authMock: any,
    mainWorker: boolean,
    storageRoot: string,
    gqlCache: Cache,
    pubsub: PubSubEngine
}

export {}
