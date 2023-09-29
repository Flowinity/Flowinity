import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { Chat } from "@app/models/chat.model"
import { ChatRank } from "@app/models/chatRank.model"

@ObjectType()
@Table
export class ChatInvite extends Model {
  @Field(() => String)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true
  })
  id: string

  @Field(() => Int)
  @Column
  userId: number

  @Field(() => Int)
  @Column
  chatId: number

  @Field(() => String, {
    nullable: true,
    description:
      "Automatically assigns rank to user when joining. If unset the backend will set the `managed` Members role."
  })
  @Column
  rankId?: string

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  expiredAt: Date

  @Field()
  @Column({
    defaultValue: false
  })
  invalidated: boolean

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: PartialUserBase

  @Field(() => Chat)
  @BelongsTo(() => Chat, "chatId")
  chat: Chat

  @Field(() => ChatRank, {
    nullable: true
  })
  @BelongsTo(() => ChatRank, "rankId")
  rank: ChatRank | null
}
