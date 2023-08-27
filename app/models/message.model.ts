import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Length,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Chat } from "@app/models/chat.model"
import { Field, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { Embed, MessageType } from "@app/classes/graphql/chat/message"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Message extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field(() => Number)
  @Column
  chatId: number

  @Field(() => Number, {
    nullable: true
  })
  @Column
  userId: number

  @Field(() => String, {
    nullable: true
  })
  @Length({
    min: 0,
    max: 4000,
    msg: "Your message must be below 4000 characters and contain content."
  })
  @Column({
    type: DataType.TEXT
  })
  content: string

  @Field(() => MessageType, {
    nullable: true
  })
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
  type: MessageType

  @Field(() => [Embed])
  @Column({
    type: DataType.JSON,
    defaultValue: []
  })
  embeds: Embed[]

  @Field()
  @Column
  edited: boolean

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  editedAt: Date

  @Field(() => Number, {
    nullable: true
  })
  @Column
  replyId: number

  @Field(() => Number, {
    nullable: true
  })
  @Column
  legacyUserId: number

  @Field()
  @Column({
    defaultValue: false
  })
  pinned: boolean

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  tpuUser: User

  @Field(() => Message, {
    nullable: true
  })
  @BelongsTo(() => Message, "replyId")
  reply: Message

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => LegacyUser, "legacyUserId")
  legacyUser: LegacyUser

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @Column({
    type: DataType.VIRTUAL,
    get(this: Message) {
      return this.tpuUser || this.legacyUser
    }
  })
  user: User | LegacyUser

  @Field(() => [ChatAssociation])
  @HasMany(() => ChatAssociation, "lastRead")
  readReceipts: ChatAssociation[]

  @Field(() => Chat)
  @BelongsTo(() => Chat, "chatId")
  chat: Chat
}
