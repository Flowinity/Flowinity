import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Float, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"
import { PermissionGroup } from "@app/classes/graphql/chat/ranks/group"
import { ChatPermission } from "@app/models/chatPermission.model"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"
import { ChatPermissionAssociation } from "@app/models/chatPermissionAssociation.model"
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

  @Field(() => Number)
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
