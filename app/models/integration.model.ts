import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"

@Table
export class Integration extends Model {
  @Column
  userId: number

  @Column
  type: string

  @Column
  accessToken: string

  @Column
  refreshToken: string

  @Column
  expiresAt: Date

  @Column
  tokenType: string

  @Column
  providerUserId: number

  @Column
  providerUsername: string

  @Column({
    type: DataType.JSON
  })
  providerUserCache: any

  @Column
  error: string

  @BelongsTo(() => User, "userId")
  user: User
}
