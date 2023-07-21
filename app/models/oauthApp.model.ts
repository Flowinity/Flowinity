import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  HasMany,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Session } from "@app/models/session.model"
import { Col } from "@troplo/sequelize/types/utils"

@DefaultScope(() => ({
  attributes: {
    exclude: ["secret"]
  }
}))
@Table
export class OauthApp extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Column
  name: string

  @Column
  icon: string

  @Column
  shortCode: string

  @Column
  verified: boolean

  @Column
  redirectUri: string

  @Column
  secret: string

  @Column
  description: string

  @Column({
    defaultValue: "oauth.user.username,oauth.user.id,oauth.user.email"
  })
  scopes: string

  @Column
  userId: number

  @Column
  private: boolean

  @BelongsTo(() => User, "userId")
  user: User

  @HasMany(() => Session, "oauthAppId")
  sessions: Session[]
}
