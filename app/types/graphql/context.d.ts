import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Cache } from "@envelop/response-cache"
import { PartialUserAuth } from "@app/classes/graphql/user/partialUser"
import { Model, ModelCtor } from "sequelize-typescript"

export type Context = {
  user: PartialUserAuth | null | undefined
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
  id: string | undefined
}
