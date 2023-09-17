import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Session } from "@app/models/session.model"

@Table
export class OauthUser extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Column
  userId: number

  @Column
  oauthAppId: string

  @Column
  active: boolean

  @BelongsTo(() => User, "userId")
  user: User

  @HasMany(() => Session, "oauthAppId")
  sessions: Session[]
}
