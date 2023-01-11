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

@Table
export class CollectionItem extends Model {
  @Column
  collectionId: number

  @Column
  attachmentId: number

  @Column
  userId: number

  @Column
  createdAt: Date

  @Column
  updatedAt: Date

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
}
