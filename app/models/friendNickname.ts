import { Table, Column, Model, BelongsTo } from "sequelize-typescript"
import { User } from "@app/models/user.model"

@Table
export class FriendNickname extends Model {
  @Column
  userId: number

  @Column
  friendId: number

  @Column
  nickname: string

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => User, "friendId")
  friend: User
}
