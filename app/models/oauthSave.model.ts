import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"

@Table
export class OauthSave extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Column
  userId: number

  @Column(DataType.UUIDV4)
  oauthAppId: string

  @Column(DataType.JSON)
  data: any

  @Column(DataType.JSON)
  history: any[]

  @BelongsTo(() => User, "userId")
  user: User
}
