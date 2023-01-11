import { Table, Column, Model, BelongsTo, Default } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"

@Table
export class CollectionUser extends Model {
  @Column
  collectionId: number

  @Default(true)
  @Column
  read: boolean

  @Default(true)
  @Column
  write: boolean

  @Default(false)
  @Column
  configure: boolean

  @Default(false)
  @Column
  accepted: boolean

  @Column
  recipientId: number

  @Column
  senderId: number

  @Column
  createdAt: Date

  @Column
  updatedAt: Date

  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @BelongsTo(() => User, "recipientId")
  user: User

  @BelongsTo(() => User, "senderId")
  sender: User
}
