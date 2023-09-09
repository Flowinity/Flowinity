import { User } from "@app/models/user.model"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import sequelize, { Sequelize } from "sequelize"
import { Cache } from "@envelop/response-cache"
import { PubSub } from "graphql-yoga"
import { PubSubEngine } from "type-graphql"

export type Context = {
  user: User | null
  client: {
    name?: string
    version?: string
  }
  scopes: string
  role: AccessLevel
  token: string
  ip: string
  dataloader: any
  meta: Record<string, any>
  req: Request
  cache: Cache
  pubsub: PubSubEngine
}
