import { Extra } from "graphql-ws/lib/use/ws"

export interface GraphQLExtra extends Extra {
  ip?: string
  id: string
  userId?: number
}
