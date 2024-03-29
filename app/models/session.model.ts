import { AllowNull, BelongsTo, Column, DataType, Default, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { SessionInfo } from "@app/classes/graphql/user/session"
import { SessionType } from "@app/classes/graphql/user/sessions"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class Session extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field({
    description: "Only populated for `API` type sessions on `currentUser`.",
    nullable: true
  })
  @Column
  token: string

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

  @Field()
  @Column
  userId: number

  @Field()
  @Column
  scopes: string

  @Field(() => SessionType)
  @Default("session")
  @Column({
    type: "enum"
  })
  type: SessionType

  @Field({
    nullable: true
  })
  @Column
  expiredAt: Date

  @Field({
    nullable: true
  })
  @AllowNull
  @Column
  name?: string

  @Field(() => SessionInfo, {
    nullable: true
  })
  @Column({
    type: DataType.JSON
  })
  info: SessionInfo

  @Field({
    nullable: true
  })
  @Column({
    type: DataType.UUIDV4
  })
  oauthAppId: string

  @BelongsTo(() => User, "userId")
  user: User
}
