import {BelongsTo, Column, Default, Model, Table} from "sequelize-typescript"
import {User} from "@app/models/user.model"

@Table
export class Notification extends Model {
  @Column
  message: string

  @Column
  userId: number

  @Default(false)
  @Column
  dismissed: boolean

  @Column
  route: string

  @BelongsTo(() => User, "userId")
  user: User
}
