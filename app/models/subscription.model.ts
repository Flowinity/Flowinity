import {
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { SubscriptionMetadata } from "@app/classes/graphql/user/subscription"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType("TPUSubscription")
@Table
export class Subscription extends Model {
  @Field(() => Int)
  @Column
  planId: number

  @Field(() => Int)
  @Column
  userId: number

  @Field(() => Int)
  @Column
  price: number

  @Field()
  @Default(false)
  @Column
  cancelled: boolean

  @Field(() => Int)
  @Column
  paymentId: number

  @Field()
  @Column
  expiredAt: Date

  @Field()
  @Column
  cancelledAt: Date

  @Field(() => SubscriptionMetadata, {
    nullable: true
  })
  @Column({
    type: DataType.JSON
  })
  metadata: object

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: User
}
