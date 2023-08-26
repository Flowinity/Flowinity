import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
  Unique
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Chat } from "@app/models/chat.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class ChatAssociation extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  chatId: number

  @Field({
    nullable: true
  })
  @Column
  userId: number

  @Field()
  @Column({
    type: DataType.ENUM("owner", "admin", "member")
  })
  rank: "owner" | "admin" | "member"

  @Field({
    nullable: true
  })
  @Column
  lastRead: number

  @Field()
  @Column({
    type: DataType.ENUM("all", "none", "mentions")
  })
  notifications: "all" | "none" | "mentions"

  @Field({
    nullable: true,
    deprecationReason: "Use `userId` instead.",
    description: "Used for legacy Colubrina accounts."
  })
  @Column
  legacyUserId: number

  @Unique
  @Column
  identifier: string

  @Field(() => PartialUserBase, {
    nullable: true,
    description:
      "Used for user virtual which falls back to a Colubrina account."
  })
  @BelongsTo(() => User, "userId")
  tpuUser: User

  @Field(() => PartialUserBase, {
    nullable: true,
    deprecationReason: "Use `user` instead.",
    description: "Used for legacy Colubrina accounts."
  })
  @BelongsTo(() => LegacyUser, "legacyUserId")
  legacyUser: LegacyUser

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @Column({
    type: DataType.VIRTUAL,
    get(this: ChatAssociation) {
      return this.tpuUser || this.legacyUser
    }
  })
  user: User | LegacyUser

  @BelongsTo(() => Chat, "chatId")
  chat: Chat
}
