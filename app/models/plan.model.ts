import {
  Table,
  Column,
  Model,
  //BelongsTo,
  Default
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
    type: "json"
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
    type: "json"
  })
  internalFeatures: object

  @Column
  icon: string
}
