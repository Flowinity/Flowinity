import { Table, Column, Model, BelongsTo } from "sequelize-typescript"
import { User } from "@app/models/user.model"

@Table
export class Report extends Model {
  @Column({
    allowNull: true
  })
  reportedByUserId: number

  @Column
  reportedUserId: number

  @Column
  uploadId: number

  @Column
  message: string

  @Column({
    allowNull: true
  })
  email: string

  @Column
  createdAt: Date

  @Column
  updatedAt: Date

  @BelongsTo(() => User, "reportedByUserId")
  reportedByUser: User

  @BelongsTo(() => User, "reportedUserId")
  reportedUser: User
}
