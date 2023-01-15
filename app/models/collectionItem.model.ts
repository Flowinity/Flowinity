import {
  Table,
  Column,
  Model,
  BelongsTo,
  Unique,
  AllowNull,
  HasOne
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionPin } from "@app/models/collectionPin.model"
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

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @HasOne(() => CollectionPin, "collectionItemId")
  pinned: CollectionPin

  @BelongsTo(() => Upload, "attachmentId")
  attachment: Upload
}
