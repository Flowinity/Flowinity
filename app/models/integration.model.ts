import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Float, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Integration extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  userId: number

  @Field()
  @Column
  type: string

  @Column
  accessToken: string

  @Column
  refreshToken: string

  @Field({
    nullable: true
  })
  @Column
  expiresAt: Date

  @Column
  tokenType: string

  @Field(() => Float, {
    nullable: true
  })
  @Column
  providerUserId: bigint

  @Field({
    nullable: true
  })
  @Column
  providerUsername: string

  // TODO: GraphQL
  @Column({
    type: DataType.JSON
  })
  providerUserCache: any

  @Field({
    nullable: true
  })
  @Column
  error: string

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User
}
