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
import { DateType } from "@app/classes/graphql/serializers/date"

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

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field()
  @Column
  name: string

  @Field({
    nullable: true,
    description:
      "Please use field `banner` instead if you want to obtain the banner for a collection."
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

  @Field({
    nullable: true
  })
  @AllowNull
  @Column
  avatar: string

  @Field(() => String, {
    nullable: true,
    description:
      "The recommended way to obtain the banner for a collection, it uses field `image`, and if null, falls back to the last added image preview."
  })
  banner: string

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

  @Field(() => Boolean, {
    description:
      "Used for the frontend for new collections on WebSocket event.",
    nullable: true
  })
  new?: boolean
}
