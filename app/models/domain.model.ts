import {
  BelongsTo,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
  Unique
} from "sequelize-typescript"

// Import Models
import { User } from "@app/models/user.model"

@Table
export class Domain extends Model {
  @Unique
  @Column({
    type: DataType.STRING(191)
  })
  domain: string

  @Column
  userId: number

  @Default(false)
  @Column
  DNSProvisioned: boolean

  @Default(false)
  @Column
  active: boolean

  @Column
  zone: string

  @Default(false)
  @Column
  advanced: boolean

  @Default(true)
  @Column
  subdomains: boolean

  @Default(true)
  @Column
  subdomainsCreate: boolean

  @Default([])
  @Column({
    type: DataType.JSON
  })
  customUserEligibility: string[]

  @Default("disabled")
  @Column({
    type: "enum"
  })
  restricted: "disabled" | "user" | "premium"

  @BelongsTo(() => User, "userId")
  user: User

  @HasMany(() => User, "domainId")
  users: User[]
}
