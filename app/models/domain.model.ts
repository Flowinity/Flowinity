import { Table, Column, Model, Default, DefaultScope, BelongsTo, DataType, Unique, HasMany } from "sequelize-typescript"
import { User } from "@app/models/user.model"

@DefaultScope(() => ({
  attributes: {
    exclude: ["password", "totpSecret"]
  }
}))
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
