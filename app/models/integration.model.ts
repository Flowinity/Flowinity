import { Table, Column, Model, DataType, BelongsTo } from "sequelize-typescript"
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

  @BelongsTo(() => User, "userId")
  user: User
}
