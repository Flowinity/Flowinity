import { BelongsTo, Column, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Message } from "@app/models/message.model"

@Table
export class MessageAttachment extends Model {
  @Column
  messageId: number

  @Column
  attachmentId: number

  @Column
  userId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => Message, "messageId")
  message: Message
}
