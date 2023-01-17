import {
  Table,
  Column,
  Model,
  BelongsTo,
  Unique,
  AllowNull, DataType
  //HasOne
  //HasMany
} from "sequelize-typescript"
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

  @Column({
    type: DataType.BOOLEAN
  })
  pinned: boolean

  @BelongsTo(() => User, "userId")
  user: User

  // associate collectionItem with collection
  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @BelongsTo(() => Upload, "attachmentId")
  attachment: Upload
}
