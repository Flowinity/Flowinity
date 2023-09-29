import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { Field, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { ChatPermission } from "@app/models/chatPermission.model"
import { ChatRank } from "@app/models/chatRank.model"

@Table
@ObjectType()
export class ChatPermissionAssociation extends Model {
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

  @Field(() => String)
  @Column
  permissionId: string

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

  @Field(() => ChatPermission)
  @BelongsTo(() => ChatPermission, "permissionId")
  permission: ChatPermission

  @Field(() => ChatRank)
  @BelongsTo(() => ChatRank, "rankId")
  rank: ChatRank
}
