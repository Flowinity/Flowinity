import {
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"
import { Field, Int, ObjectType } from "type-graphql"

@ObjectType({
  description: "Old Colubrina friends. IDs are LegacyUser"
})
@Table
export class LegacyFriend extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  userId: number

  @Field()
  @Column
  friendId: number

  @Field()
  @Column
  createdAt: Date

  @Field()
  @Column
  updatedAt: Date

  @Field(() => String)
  @Column({
    type: DataType.ENUM("pending", "accepted", "pendingCanAccept", "rejected")
  })
  status: "pending" | "accepted" | "pendingCanAccept" | "rejected"
}
