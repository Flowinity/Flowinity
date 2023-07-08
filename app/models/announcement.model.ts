import {BelongsTo, Column, Model, Table} from "sequelize-typescript"

// Import Models
import {User} from "@app/models/user.model"

@Table
export class Announcement extends Model {
    @Column
    userId: number

    @Column
    content: string

    @Column
    type: string

    @BelongsTo(() => User, "userId")
    user: User
}
