import { InferAttributes, InferCreationAttributes, Model } from "sequelize"

declare enum SessionType {
  api = "api",
  session = "session"
}

declare class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  token: string
  userId: number
  scopes: string
  type: SessionType
  expiredAt: Date
  createdAt: Date
  updatedAt: Date
  name?: string
}
