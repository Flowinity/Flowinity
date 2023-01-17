import { Table, Column, Model, BelongsTo } from "sequelize-typescript"
import { User } from "@app/models/user.model"

@Table
export class Announcement extends Model {
  @Column
  userId: number

  @Column
  content: string

  @Column
  type: string

  @BelongsTo(() => User, "userId")
  user: User
}
