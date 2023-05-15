import {BelongsTo, Column, DataType, Model, Table, Unique} from "sequelize-typescript"
import {User} from "@app/models/user.model"
import {LegacyUser} from "@app/models/legacyUser.model"
import {Chat} from "@app/models/chat.model"

@Table
export class ChatAssociation extends Model {
  @Column
  chatId: number

  @Column
  userId: number

  @Column({
    type: DataType.ENUM("owner", "admin", "member")
  })
  rank: "owner" | "admin" | "member"

  @Column
  lastRead: number

  @Column({
    type: DataType.ENUM("all", "none", "mentions")
  })
  notifications: "all" | "none" | "mentions"

  @Column
  legacyUserId: number

  @Unique
  @Column
  identifier: string

  @BelongsTo(() => User, "userId")
  tpuUser: User

  @BelongsTo(() => LegacyUser, "legacyUserId")
  legacyUser: LegacyUser

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
