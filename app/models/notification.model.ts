import { BelongsTo, Column, DataType, Default, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class Notification extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT
  })
  id: number

  @Field()
  @Column
  message: string

  @Field()
  @Column
  userId: number

  @Field()
  @Default(false)
  @Column
  dismissed: boolean

  @Field({
    nullable: true
  })
  @Column
  route: string

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
