import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"

@Table
export class FCMDevice extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Column
  userId: number

  @Column
  registrationKey: string

  @Column
  invalid: boolean

  @AllowNull
  @Column
  notificationKey?: string

  @BelongsTo(() => User, "userId")
  user: User
}
