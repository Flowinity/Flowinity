import {
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { SubscriptionMetadata } from "@app/classes/graphql/user/subscription"

@ObjectType()
@Table
export class Subscription extends Model {
  @Field()
  @Column
  planId: number

  @Field()
  @Column
  userId: number

  @Field()
  @Column
  price: number

  @Field()
  @Default(false)
  @Column
  cancelled: boolean

  @Field()
  @Column
  paymentId: number

  @Field()
  @Column
  expiredAt: Date

  @Field()
  @Column
  cancelledAt: Date

  @Field(() => SubscriptionMetadata)
  @Column({
    type: DataType.JSON
  })
  metadata: object

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User
}
