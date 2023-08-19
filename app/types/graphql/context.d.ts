import { User } from "@app/models/user.model"
import { AccessLevel } from "@app/enums/admin/AccessLevel"

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
}
