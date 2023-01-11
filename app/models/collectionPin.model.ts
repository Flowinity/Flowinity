import { Table, Column, Model, BelongsTo } from "sequelize-typescript"
import { User } from "@app/models/user.model"

@Table
export class CollectionPin extends Model {
  @Column
  collectionId: number

  @Column
  collectionItemId: number

  @Column
  userId: number

  @Column
  createdAt: Date

  @Column
  updatedAt: Date

  @BelongsTo(() => User, "userId")
  user: User
}
