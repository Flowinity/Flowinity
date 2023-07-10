import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"

// Import Models
import { User } from "@app/models/user.model"

@Table
export class Friend extends Model {
  @AllowNull(false)
  @Column(DataType.ENUM("incoming", "outgoing", "accepted"))
  status: "incoming" | "outgoing" | "accepted"

  @Column
  userId: number

  @Column
  friendId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => User, "friendId")
  otherUser: User
}
