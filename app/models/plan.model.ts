import {Column, DataType, Default, Model, Table} from "sequelize-typescript"

@Table
export class Plan extends Model {
    @Column
    name: string

    @Column({
        type: DataType.BIGINT
    })
    quotaMax: bigint

    @Column({
        type: DataType.BIGINT
    })
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
