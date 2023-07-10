import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"

// Import Models
import { User } from "@app/models/user.model"

@Table
export class BadgeAssociation extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  badgeId: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId: number

  @Column({
    type: DataType.DATE
  })
  expiredAt: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  hidden: boolean

  @BelongsTo(() => User, "userId")
  user: User
}
