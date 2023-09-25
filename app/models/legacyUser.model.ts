import {
  Column,
  DataType,
  DefaultScope,
  Model,
  Table
} from "sequelize-typescript"
import { Field, ObjectType } from "type-graphql"

@ObjectType({
  description: "Old Colubrina users"
})
@DefaultScope(() => ({
  attributes: {
    exclude: ["password"]
  }
}))
@Table
export class LegacyUser extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  username: string

  @Field()
  @Column
  name: string

  @Field()
  @Column
  email: string

  @Field()
  @Column
  password: string

  @Field()
  @Column
  createdAt: Date

  @Field()
  @Column
  updatedAt: Date

  @Field()
  @Column
  emailVerified: boolean

  @Field()
  @Column
  admin: boolean

  @Field()
  @Column
  avatar: string

  @Field(() => String)
  @Column(DataType.ENUM("online", "busy", "away", "offline", "invisible"))
  status: "online" | "busy" | "away" | "offline" | "invisible"

  @Field(() => String)
  @Column(DataType.ENUM("online", "busy", "away", "invisible"))
  storedStatus: "online" | "busy" | "away" | "invisible"

  @Field()
  @Column
  administrator: boolean

  @Field()
  @Column
  moderator: boolean

  @Field()
  @Column({
    type: DataType.VIRTUAL,
    get() {
      return false
    }
  })
  bot: boolean
}
