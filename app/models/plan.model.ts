import {
  Table,
  Column,
  Model,
  //BelongsTo,
  Default,
  DataType
} from "sequelize-typescript"
@Table
export class Plan extends Model {
  @Column
  name: string

  @Column
  quotaMax: bigint

  @Column
  price: bigint

  @Column({
    type: DataType.JSON
  })
  features: object

  @Column
  color: string

  @Column
  internalName: string

  @Default(false)
  @Column
  purchasable: boolean

  @Column({
    type: DataType.JSON
  })
  internalFeatures: object

  @Column
  icon: string
}
