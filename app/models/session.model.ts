import {
  Table,
  Column,
  Model,
  BelongsTo,
  Default,
  AllowNull
} from "sequelize-typescript"
import { User } from "@app/models/user.model"

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

  @BelongsTo(() => User, "userId")
  user: User
}
