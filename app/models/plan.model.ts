import { Column, DataType, Default, Model, Table } from "sequelize-typescript"
import { Field, Float, ObjectType } from "type-graphql"

@ObjectType()
@Table
export class Plan extends Model {
  @Field()
  @Column
  name: string

  @Field(() => Float)
  @Column({
    type: DataType.BIGINT
  })
  quotaMax: bigint

  @Field(() => Float, {
    deprecationReason: "Plans are unused in TPUv2+."
  })
  @Column({
    type: DataType.BIGINT
  })
  price: bigint

  @Field(() => String, {
    nullable: true,
    deprecationReason: "Plans are unused in TPUv2+."
  })
  @Column({
    type: DataType.JSON
  })
  features: string[]

  @Field(() => String, {
    nullable: true
  })
  @Column
  color: string

  @Field(() => String)
  @Column
  internalName: string

  @Field({
    deprecationReason: "Plans are unused in TPUv2+."
  })
  @Default(false)
  @Column
  purchasable: boolean

  @Field(() => String, {
    nullable: true,
    deprecationReason: "Plans are unused in TPUv2+."
  })
  @Column({
    type: DataType.JSON
  })
  internalFeatures: string[]

  @Field(() => String)
  @Column
  icon: string
}
