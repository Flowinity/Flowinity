import {
  Table,
  Column,
  Model,
  BelongsTo,
  DataType,
  Length,
  HasMany
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Chat } from "@app/models/chat.model"

@Table
export class Message extends Model {
  @Column
  chatId: number

  @Column
  userId: number

  @Length({
    min: 1,
    max: 2000,
    msg: "Your message must be below 2000 characters and contain content."
  })
  @Column({
    type: DataType.TEXT
  })
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
  tpuUser: User

  @BelongsTo(() => Message, "replyId")
  reply: Message

  @BelongsTo(() => LegacyUser, "legacyUserId")
  legacyUser: LegacyUser

  @Column({
    type: DataType.VIRTUAL,
    get(this: Message) {
      return this.tpuUser || this.legacyUser
    }
  })
  user: User | LegacyUser

  @HasMany(() => ChatAssociation, "lastRead")
  readReceipts: ChatAssociation[]

  @BelongsTo(() => Chat, "chatId")
  chat: Chat
}
