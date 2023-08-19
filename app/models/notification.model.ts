import {
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Float, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Notification extends Model {
  @Field(() => Float)
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

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: User
}
