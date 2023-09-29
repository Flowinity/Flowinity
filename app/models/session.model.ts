import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { SessionInfo } from "@app/types/auth"

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

  @Column
  token: string

  @Field()
  @Column
  userId: number

  @Field()
  @Column
  scopes: string

  @Field()
  @Default("session")
  @Column({
    type: "enum"
  })
  type: "api" | "session" | "oauth"

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
