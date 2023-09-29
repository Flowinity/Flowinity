import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"
import { Field, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { ChatPermission } from "@app/models/chatPermission.model"
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

  @Field(() => Int)
  @Column
  userId: number

  @Field(() => DateType, {
    nullable: true
  })
  @Column(DataType.DATE)
  createdAt: Date

  @Field(() => Int)
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

  @Field(() => Int)
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
  associations: ChatAssociation[]
}
