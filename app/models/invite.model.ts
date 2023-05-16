import {
  BelongsTo,
  Column,
  DataType,
  Default,
  DefaultScope,
  IsEmail,
  Model,
  Table,
  Unique
} from "sequelize-typescript"
import { User } from "@app/models/user.model"

@DefaultScope(() => ({
  attributes: {
    exclude: ["adminId", "inviteKey", "email"]
  }
}))
@Table
export class Invite extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true
  })
  inviteKey: string

  @Unique
  @IsEmail
  @Column
  email: string

  @Column({
    type: DataType.ENUM("pending", "accepted", "rejected")
  })
  status: "pending" | "accepted" | "rejected"

  @Column
  userId: number

  @Column
  registerUserId: number

  @Column
  adminId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => User, "registerUserId")
  invited: User
}
