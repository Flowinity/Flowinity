import {AllowNull, BelongsTo, Column, DataType, Default, Model, Table} from "sequelize-typescript"
import {User} from "@app/models/user.model"

@Table
export class Pulse extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Column
  userId: number

  @Default("other")
  @Column({
    type: "enum"
  })
  action:
    | "focus"
    | "item-collected"
    | "gallery-page-change"
    | "other"
    | "page-change"
    | "collection-page-change"
    | "auto-collect-rejected"
    | "auto-collect-accepted"

  @AllowNull
  @Column
  route: string

  @AllowNull
  @Column
  timeSpent: number

  @AllowNull
  @Column
  device: string

  @Column({
    type: DataType.JSON
  })
  sysInfo: PulseSysInfo

  @AllowNull
  @Column
  name: string

  @Default({})
  @Column({
    type: DataType.JSON
  })
  other: {
    type: string
  }

  @BelongsTo(() => User, "userId")
  user: User
}
