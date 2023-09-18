import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { ChatRank } from "@app/models/chatRank.model"
import { Message } from "@app/models/message.model"

@ObjectType()
@Table
export class Chat extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column({
    type: DataType.ENUM("direct", "group", "channel")
  })
  type: "direct" | "group" | "channel"

  @Field()
  @Column
  name: string

  @Field({
    nullable: true,
    description:
      "Null if the chat is owned by a Colubrina legacy user, or the account was deleted."
  })
  @Column
  userId: number

  @Field({
    nullable: true
  })
  @Column
  icon: string

  @Field()
  @Column
  createdAt: Date

  @Field()
  @Column
  updatedAt: Date

  @Field({
    nullable: true,
    description:
      "This is used if the chat is owned by a Colubrina legacy user.",
    deprecationReason: "Use userId instead."
  })
  @Column
  legacyUserId: number

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  intent: null | string

  @Field(() => PartialUserBase, {
    nullable: true,
    description:
      "Null if the chat is owned by a Colubrina legacy user, or the account was deleted."
  })
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => PartialUserBase, {
    nullable: true,
    description:
      "This is used if the chat is owned by a Colubrina legacy user.",
    deprecationReason: "Use user instead."
  })
  @BelongsTo(() => LegacyUser, "legacyUserId")
  legacyUser: LegacyUser

  @Field(() => ChatAssociation, {
    nullable: true
  })
  @HasOne(() => ChatAssociation, "chatId")
  association: ChatAssociation

  @Field(() => [ChatAssociation])
  @HasMany(() => ChatAssociation, "chatId")
  users: ChatAssociation[]
  recipient: any
  @Field(() => Number, {
    nullable: true
  })
  unread: number | undefined
  @Field(() => String, {
    nullable: true
  })
  _redisSortDate: string | undefined

  @Field(() => [ChatRank])
  @HasMany(() => ChatRank, "chatId")
  ranks: ChatRank[]

  @Field(() => [Message])
  messages: Message[]
}
