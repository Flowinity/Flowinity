import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"
import { Field, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Chat } from "@app/models/chat.model"
import { ChatRank } from "@app/models/chatRank.model"

@Table
@ObjectType()
export class ChatRankAssociation extends Model {
  @Field(() => String)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Field(() => String)
  @Column
  rankId: string

  @Field(() => Int)
  @Column
  chatAssociationId: number

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  createdAt: Date

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  updatedAt: Date

  @Field(() => [ChatRank])
  @BelongsTo(() => ChatRank, "rankId")
  rank: ChatRank

  @Field(() => ChatAssociation)
  @BelongsTo(() => ChatAssociation, "chatAssociationId")
  chatAssociation: ChatAssociation

  @Field(() => Chat)
  @BelongsToMany(() => Chat, () => ChatAssociation, "chatId", "chatId")
  chat: Chat
}
