import {
  Table,
  Column,
  Model,
  BelongsTo,
  Unique,
  AllowNull,
  HasOne
  //HasMany
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Upload } from "@app/models/upload.model"
import { CollectionPin } from "@app/models/collectionPin.model"

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

  @BelongsTo(() => Upload, "attachmentId")
  attachment: Upload

  @HasOne(() => CollectionPin, "collectionItemId")
  pinned: CollectionPin
}
