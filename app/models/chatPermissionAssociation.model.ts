import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Float, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"
import { PermissionGroup } from "@app/classes/graphql/chat/ranks/group"
import { ChatPermission } from "@app/models/chatPermission.model"
import { ChatRank } from "@app/models/chatRank.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"

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
  createdAt: string

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  updatedAt: string

  @Field(() => ChatPermission)
  @BelongsTo(() => ChatPermission, "permissionId")
  permission: ChatPermission

  @Field(() => ChatRank)
  @BelongsTo(() => ChatRank, "rankId")
  rank: ChatRank
}
