import {
  Table,
  Column,
  Model,
  BelongsTo,
  Unique,
  HasOne,
  HasMany
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
    type: "json"
  })
  data: object
  //    Uploads.belongsTo(models.User)
  //       Uploads.belongsTo(models.User, {
  //         as: "user",
  //         foreignKey: "UserId"
  //       })
  //       Uploads.hasMany(models.CollectionItem, {
  //         as: "items",
  //         foreignKey: "attachmentId"
  //       })
  //       Uploads.hasOne(models.CollectionItem, {
  //         as: "item",
  //         foreignKey: "attachmentId"
  //       })
  //       Uploads.hasOne(models.Star, {
  //         as: "starred",
  //         foreignKey: "attachmentId"
  //       })
  //       Uploads.belongsToMany(models.Collection, {
  //         through: "collectionItems",
  //         as: "collections",
  //         foreignKey: "attachmentId"
  //       })
  //       Uploads.belongsTo(models.Folder, {
  //         as: "folder",
  //         foreignKey: "folderId"
  //       })
  @BelongsTo(() => User, "userId")
  user: User

  @HasOne(() => CollectionItem, "attachmentId")
  item: CollectionItem

  @HasOne(() => CollectionPin, "attachmentId")
  starred: CollectionPin

  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @HasMany(() => CollectionItem, "attachmentId")
  items: CollectionItem[]
}
