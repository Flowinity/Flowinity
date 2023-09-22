import {
  BelongsTo,
  Column,
  DataType,
  Default,
  DefaultScope,
  IsEmail,
  Model,
  Table,
  Unique
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class ChatInvite extends Model {
  @Field(() => String)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true
  })
  id: string

  @Field(() => Number)
  @Column
  userId: number

  @Field(() => Number)
  @Column
  chatId: number

  @Field(() => String, {
    nullable: true,
    description:
      "Automatically assigns rank to user when joining. If unset the backend will set the `managed` Members role."
  })
  @Column
  rankId?: string

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field(() => DateType, {
    nullable: true
  })
  @Column
  expiredAt: Date

  @Field()
  @Column({
    defaultValue: false
  })
  invalidated: boolean

  @BelongsTo(() => User, "userId")
  user: User
}
