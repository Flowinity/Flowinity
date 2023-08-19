import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Float, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@Table
@ObjectType()
export class Announcement extends Model {
  @Field(() => Float)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT
  })
  id: number

  @Field()
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

  @Field()
  @BelongsTo(() => User, "userId")
  user: PartialUserBase
}
