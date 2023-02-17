import {
  Table,
  Column,
  Model,
  BelongsTo,
  DataType,
  HasOne,
  HasMany
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"

@Table
export class Chat extends Model {
  @Column({
    type: DataType.ENUM("direct", "group", "channel")
  })
  type: "direct" | "group" | "channel"

  @Column
  name: string

  @Column
  userId: number

  @Column
  icon: string

  @Column
  createdAt: Date

  @Column
  updatedAt: Date

  @Column
  legacyUserId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => LegacyUser, "legacyUserId")
  legacyUser: LegacyUser

  @HasOne(() => ChatAssociation, "chatId")
  association: ChatAssociation

  @HasMany(() => ChatAssociation, "chatId")
  users: ChatAssociation[]
}
