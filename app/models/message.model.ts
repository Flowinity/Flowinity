import { Table, Column, Model, BelongsTo, DataType } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"

@Table
export class Message extends Model {
  @Column
  chatId: number

  @Column
  userId: number

  @Column
  content: string

  @Column({
    type: DataType.ENUM(
      "message",
      "leave",
      "join",
      "pin",
      "administrator",
      "rename",
      "system"
    )
  })
  type:
    | "message"
    | "leave"
    | "join"
    | "pin"
    | "administrator"
    | "rename"
    | "system"

  @Column({
    type: DataType.JSON,
    defaultValue: []
  })
  embeds: any[]

  @Column
  edited: boolean

  @Column
  editedAt: Date

  @Column
  replyId: number

  @Column
  legacyUserId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => Message, "replyId")
  reply: Message

  @BelongsTo(() => LegacyUser, "legacyUserId")
  legacyUser: LegacyUser
}
