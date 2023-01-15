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
import { CollectionPin } from "@app/models/collectionPin.model"
import { CollectionItem } from "@app/models/collectionItem.model"

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

  @BelongsTo(() => User, "userId")
  user: User

  @HasOne(() => CollectionItem, "attachmentId")
  item: CollectionItem

  @HasOne(() => CollectionPin, "attachmentId")
  starred: CollectionPin

  @BelongsToMany(
    () => Collection,
    () => CollectionItem,
    "attachmentId",
    "collectionId"
  )
  collections: Collection[]

  @HasMany(() => CollectionItem, "attachmentId")
  items: CollectionItem[]
}
