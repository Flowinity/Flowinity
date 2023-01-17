import {
  Table,
  Column,
  Model,
  BelongsTo,
  Unique,
  AllowNull,
  //HasOne
  //HasMany
} from "sequelize-typescript";
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Upload } from "@app/models/upload.model"

@Table
export class CollectionItem extends Model {
  @Column
  collectionId: number

  @Column
  attachmentId: number

  @Column
  userId: number

  @Unique
  @AllowNull
  @Column
  identifier: string

  @Column
  pinned: boolean

  @BelongsTo(() => User, "userId")
  user: User

  // associate collectionItem with collection
  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @BelongsTo(() => Upload, "attachmentId")
  attachment: Upload
}
