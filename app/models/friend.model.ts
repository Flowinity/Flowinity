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
import {
  PartialUserBase,
  PartialUserFriend
} from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"

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

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

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

  @Field(() => PartialUserFriend)
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => PartialUserFriend)
  @BelongsTo(() => User, "friendId")
  otherUser: User
}
