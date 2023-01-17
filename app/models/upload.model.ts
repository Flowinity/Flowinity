import {
  Table,
  Column,
  Model,
  BelongsTo,
  Unique,
  HasOne,
  HasMany,
  BelongsToMany,
  DataType
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Star } from "@app/models/star.model"

@Table
export class Upload extends Model {
  @Unique
  @Column
  attachment: string

  @Column
  userId: number

  @Column
  name: string

  @Column
  originalFilename: string

  @Column({
    type: "enum",
    values: ["image", "video", "link", "binary", "text", "audio", "paste"]
  })
  type: "image" | "video" | "link" | "binary" | "text" | "audio" | "paste"

  @Column
  urlRedirect: string

  @Column
  fileSize: number

  @Column
  deletable: boolean

  @Column({
    type: DataType.JSON
  })
  data: object

  @Column({
    type: DataType.TEXT
  })
  textMetadata: string

  @BelongsTo(() => User, "userId")
  user: User

  @HasOne(() => CollectionItem, "attachmentId")
  item: CollectionItem

  @BelongsToMany(
    () => Collection,
    () => CollectionItem,
    "attachmentId",
    "collectionId"
  )
  collections: Collection[]

  @HasMany(() => CollectionItem, "attachmentId")
  items: CollectionItem[]

  @HasOne(() => Star, "attachmentId")
  starred: Star
}
