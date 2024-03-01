import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"

@Table
@ObjectType()
export class Announcement extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT
  })
  id: number

  @Field({
    nullable: true
  })
  @Column
  userId: number

  @Field()
  @Column
  content: string

  @Field({
    nullable: true
  })
  @Column
  type: string

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  createdAt: Date

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  updatedAt: Date

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: PartialUserBase
}
