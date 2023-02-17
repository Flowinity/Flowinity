import { Table, Column, Model, BelongsTo, DataType } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { LegacyUser } from "@app/models/legacyUser.model"

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
}
