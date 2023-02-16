import { Table, Column, Model, BelongsTo } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Message } from "@app/models/message.model"
import { LegacyUser } from "@app/models/legacyUser.model"

@Table
export class MessageAttachment extends Model {
  @Column
  messageId: number

  @Column
  attachmentId: number

  @Column
  userId: number

  @Column
  legacyUserId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => LegacyUser, "legacyUserId")
  legacyUser: LegacyUser

  @BelongsTo(() => Message, "messageId")
  message: Message
}
