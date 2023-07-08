import {BelongsTo, Column, Model, Table} from "sequelize-typescript"

// Import Models
import {User} from "@app/models/user.model"

@Table
export class FriendNickname extends Model {
    @Column
    userId: number

    @Column
    friendId: number

    @Column
    nickname: string

    @BelongsTo(() => User, "userId")
    user: User

    @BelongsTo(() => User, "friendId")
    friend: User
}
