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
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class BlockedUser extends Model {
  @Field(() => String)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Field(() => Number)
  @Column
  userId: number

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field(() => Number)
  @Column
  blockedUserId: number

  @Field({
    description:
      "To the blocked user it appears as though they're unblocked, however the blocker will not receive any messages from them, and their messages will be hidden inside of group chats."
  })
  @Column
  silent: boolean

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: PartialUserBase

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "blockedUserId")
  blockedUser: PartialUserBase
}
