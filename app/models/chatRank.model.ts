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
import { ChatRankAssociation } from "@app/models/chatRankAssociation.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"

@Table
@ObjectType()
export class ChatRank extends Model {
  @Field(() => String)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Field({
    nullable: true
  })
  @Column
  color: string

  @Field()
  @Column
  name: string

  @Field(() => Number)
  @Column
  userId: number

  @Field(() => DateType, {
    nullable: true
  })
  @Column(DataType.DATE)
  createdAt: Date

  @Field(() => Number)
  @Column
  chatId: number

  @Field(() => DateType, {
    nullable: true
  })
  @Column(DataType.DATE)
  updatedAt: Date

  @Field(() => Boolean)
  @Column({
    defaultValue: false
  })
  managed: boolean

  @Field(() => Number)
  @Column
  index: number

  @Field(() => [ChatPermission])
  @BelongsToMany(
    () => ChatPermission,
    () => ChatPermissionAssociation,
    "rankId",
    "permissionId"
  )
  permissions: ChatPermission[]

  @Field(() => [String])
  permissionsMap: string[]

  @Field(() => [ChatAssociation])
  @BelongsToMany(
    () => ChatAssociation,
    () => ChatRankAssociation,
    "rankId",
    "chatAssociationId"
  )
  ranks: ChatAssociation[]
}
