import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"

// Import Models
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"

@Table
export class Badge extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string

  @Column
  description: string

  @Column
  tooltip: string

  @Column
  image: string

  @Column
  icon: string

  @Column
  color: string

  @Column
  unlocked: boolean

  @Column
  priority: number

  @BelongsTo(() => Plan, "planId")
  plan: Plan

  @BelongsToMany(() => User, () => BadgeAssociation, "badgeId", "userId")
  users: User[]
}
