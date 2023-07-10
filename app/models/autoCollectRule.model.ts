import {
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  Table
} from "sequelize-typescript"

// Import Models
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"

@Table
export class AutoCollectRule extends Model {
  @Column
  name: string

  @Default(true)
  @Column
  enabled: boolean

  @Column
  collectionId: number

  @Default(true)
  @Column
  requireApproval: boolean

  @Default([])
  @Column({
    type: DataType.JSON
  })
  rules: object

  @Column
  userId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => Collection, "collectionId")
  collection: User
}
