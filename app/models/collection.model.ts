import {
  AllowNull,
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
import { CollectionItem } from "@app/models/collectionItem.model"
import { CollectionUser } from "@app/models/collectionUser.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { Upload } from "@app/models/upload.model"
import { PermissionsMetadata } from "@app/classes/graphql/collections/collections"

@ObjectType()
@Table
export class Collection extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  name: string

  @Field({
    nullable: true
  })
  @AllowNull
  @Column
  image: string

  @Field()
  @Column
  userId: number

  @Field({
    nullable: true
  })
  @AllowNull
  @Column
  shareLink: string

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User

  @HasMany(() => CollectionItem, "collectionId")
  items: CollectionItem[]

  @Field(() => CollectionItem, {
    nullable: true
  })
  @HasOne(() => CollectionItem, "collectionId")
  preview: CollectionItem

  @Field(() => [CollectionUser])
  @HasMany(() => CollectionUser, "collectionId")
  users: CollectionUser[]

  @Field(() => CollectionUser, {
    nullable: true
  })
  @HasOne(() => CollectionUser, "collectionId")
  recipient: CollectionUser

  @Field(() => [AutoCollectApproval])
  @HasMany(() => AutoCollectApproval, "collectionId")
  autoCollectApprovals: AutoCollectApproval[]

  @Field(() => Boolean, {
    nullable: true
  })
  shared?: boolean

  @Field(() => Int, {
    nullable: true
  })
  itemCount?: number

  @Field(() => [Upload])
  @BelongsToMany(
    () => Upload,
    () => CollectionItem,
    "collectionId",
    "attachmentId"
  )
  attachments: Upload[]

  @Field(() => PermissionsMetadata, {
    defaultValue: {
      write: false,
      read: true,
      configure: false
    }
  })
  permissionsMetadata: PermissionsMetadata
}
