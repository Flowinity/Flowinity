import {
  Table,
  Column,
  Model,
  DataType,
  DefaultScope
} from "sequelize-typescript"

@DefaultScope(() => ({
  attributes: {
    exclude: ["password"]
  }
}))
@Table
export class LegacyUser extends Model {
  @Column
  username: string

  @Column
  name: string

  @Column
  email: string

  @Column
  password: string

  @Column
  createdAt: Date

  @Column
  updatedAt: Date

  @Column
  emailVerified: boolean

  @Column
  admin: boolean

  @Column(DataType.ENUM("online", "busy", "away", "offline", "invisible"))
  status: "online" | "busy" | "away" | "offline" | "invisible"

  @Column(DataType.ENUM("online", "busy", "away", "invisible"))
  storedStatus: "online" | "busy" | "away" | "invisible"
}
