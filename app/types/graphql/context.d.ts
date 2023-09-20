import { User } from "@app/models/user.model"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Cache } from "@envelop/response-cache"
import { PubSubEngine } from "type-graphql"

export type Context = {
  user: User | null | undefined
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
  request: Request
  cache: Cache
  pubsub: PubSubEngine
}
