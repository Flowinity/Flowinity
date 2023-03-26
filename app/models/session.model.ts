import {
  Table,
  Column,
  Model,
  BelongsTo,
  Default,
  AllowNull,
  DataType
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { SessionInfo } from "@app/types/auth"

@Table
export class Session extends Model {
  @Column
  token: string

  @Column
  userId: number

  @Column
  scopes: string

  @Default("session")
  @Column({
    type: "enum"
  })
  type: "api" | "session"

  @Column
  expiredAt: Date

  @AllowNull
  @Column
  name?: string

  @Column({
    type: DataType.JSON
  })
  info: SessionInfo

  @BelongsTo(() => User, "userId")
  user: User
}
