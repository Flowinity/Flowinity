import { BelongsTo, Column, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Experiment extends Model {
  @Field()
  @Column
  key: string

  @Field()
  @Column
  value: string

  @Field()
  @Column
  userId: number

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User
}
