import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Float, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"
import { PermissionGroup } from "@app/classes/graphql/chat/ranks/group"
import { ChatPermissionAssociation } from "@app/models/chatPermissionAssociation.model"
import { Collection } from "@app/models/collection.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { ChatRankAssociation } from "@app/models/chatRankAssociation.model"
import { ChatRank } from "@app/models/chatRank.model"

@Table
@ObjectType()
export class ChatPermission extends Model {
  @Field(() => String)
  @Column({
    primaryKey: true,
    type: DataType.STRING
  })
  id: string

  @Field()
  @Column
  description: string

  @Field()
  @Column
  name: string

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  createdAt: string

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  updatedAt: string

  @Field(() => PermissionGroup)
  @Column
  group: PermissionGroup

  @Field(() => [ChatPermissionAssociation])
  @HasMany(() => ChatPermissionAssociation, "permissionId")
  associations: ChatPermissionAssociation[]

  @BelongsToMany(
    () => ChatRank,
    () => ChatPermissionAssociation,
    "permissionId",
    "rankId"
  )
  ranks: ChatRank[]
}
