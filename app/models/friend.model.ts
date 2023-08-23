import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, Float, ObjectType } from "type-graphql"
import { FriendStatus } from "@app/classes/graphql/user/friends"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Friend extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field(() => FriendStatus)
  @AllowNull(false)
  @Column(DataType.ENUM("incoming", "outgoing", "accepted"))
  status: "incoming" | "outgoing" | "accepted"

  @Field(() => Float)
  @Column
  userId: number

  @Field(() => Float)
  @Column
  friendId: number

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "friendId")
  otherUser: User
}
