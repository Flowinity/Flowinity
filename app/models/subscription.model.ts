import {BelongsTo, Column, DataType, Default, Model, Table} from "sequelize-typescript"
import {User} from "@app/models/user.model"

@Table
export class Subscription extends Model {
  @Column
  planId: number

  @Column
  userId: number

  @Column
  price: number

  @Default(false)
  @Column
  cancelled: boolean

  @Column
  paymentId: number

  @Column
  expiredAt: Date

  @Column
  cancelledAt: Date

  @Column({
    type: DataType.JSON
  })
  metadata: object

  @BelongsTo(() => User, "userId")
  user: User
}
