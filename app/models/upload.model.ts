import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
  Unique
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Star } from "@app/models/star.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class Upload extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT
  })
  id: number

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field()
  @Unique
  @Column
  attachment: string

  @Field()
  @Column
  userId: number

  @Field({
    nullable: true
  })
  @Column
  name: string

  @Field({
    nullable: true
  })
  @Column
  originalFilename: string

  @Field()
  @Column({
    type: "enum",
    values: ["image", "video", "link", "binary", "text", "audio", "paste"]
  })
  type: "image" | "video" | "link" | "binary" | "text" | "audio" | "paste"

  @Field({
    nullable: true,
    deprecationReason: "URL redirects were removed in TPUv2/NEXT."
  })
  @Column
  urlRedirect: string

  @Field()
  @Column
  fileSize: number

  @Field({
    description:
      "Non-deletable items are used for profile pictures, banners, etc and are not visible in the Gallery page."
  })
  @Column
  deletable: boolean

  // TODO: GraphQL type, unused anyway
  @Column({
    type: DataType.JSON
  })
  data: object

  @Field({
    nullable: true,
    description: "This is used for OCR scanned text from images."
  })
  @Column({
    type: DataType.TEXT
  })
  textMetadata: string

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => CollectionItem, {
    nullable: true
  })
  @HasOne(() => CollectionItem, "attachmentId")
  item: CollectionItem

  @Field(() => [Collection])
  @BelongsToMany(
    () => Collection,
    () => CollectionItem,
    "attachmentId",
    "collectionId"
  )
  collections: Collection[]

  @Field(() => [CollectionItem])
  @HasMany(() => CollectionItem, "attachmentId")
  items: CollectionItem[]

  @Field(() => Star, {
    nullable: true
  })
  @HasOne(() => Star, "attachmentId")
  starred: Star

  @Field(() => AutoCollectApproval, {
    nullable: true
  })
  @HasOne(() => AutoCollectApproval, "uploadId")
  autoCollectApproval: AutoCollectApproval
}
