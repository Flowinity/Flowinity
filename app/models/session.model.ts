import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { SessionInfo } from "@app/types/auth"
import { Col } from "@troplo/sequelize/types/utils"

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
  type: "api" | "session" | "oauth"

  @Column
  expiredAt: Date

  @AllowNull
  @Column
  name?: string

  @Column({
    type: DataType.JSON
  })
  info: SessionInfo

  @Column({
    type: DataType.UUIDV4
  })
  oauthAppId: string

  @BelongsTo(() => User, "userId")
  user: User
}
