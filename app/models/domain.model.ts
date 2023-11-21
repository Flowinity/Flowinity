import { BelongsTo, Column, DataType, Default, HasMany, Model, Table, Unique } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Domain extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Field()
  @Unique
  @Column({
    type: DataType.STRING
  })
  domain: string

  @Field(() => Int)
  @Column
  userId: number

  @Field({
    deprecationReason: "Use `active` instead."
  })
  @Default(false)
  @Column
  DNSProvisioned: boolean

  @Field()
  @Default(false)
  @Column
  active: boolean

  @Field({
    deprecationReason: "Cloudflare integration was removed in TPUv2.",
    nullable: true
  })
  @Column
  zone: string

  @Field({
    deprecationReason: "Cloudflare integration was removed in TPUv2.",
    nullable: true
  })
  @Default(false)
  @Column
  advanced: number

  @Field({
    deprecationReason: "Subdomains were removed in TPUv2."
  })
  @Default(true)
  @Column
  subdomains: boolean

  @Field({
    deprecationReason: "Subdomains were removed in TPUv2."
  })
  @Default(true)
  @Column
  subdomainsCreate: boolean

  @Field(() => [Int], {
    deprecationReason: "Granular user control was removed in TPUv2.",
    nullable: true
  })
  @Default([])
  @Column({
    type: DataType.JSON
  })
  customUserEligibility: string[]

  @Field({
    deprecationReason: "Granular user control was removed in TPUv2."
  })
  @Default("disabled")
  @Column({
    type: "enum"
  })
  restricted: "disabled" | "user" | "premium"

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => [PartialUserBase], {
    nullable: true,
    description: "Only populated in some admin contexts"
  })
  @HasMany(() => User, "domainId")
  users: User[]
}
