import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript"
import { Field, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { PermissionGroup } from "@app/classes/graphql/chat/ranks/group"
import { ChatPermissionAssociation } from "@app/models/chatPermissionAssociation.model"
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
