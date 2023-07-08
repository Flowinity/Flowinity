import {BelongsTo, Column, Model, Table} from "sequelize-typescript"

// Import Models
import {User} from "@app/models/user.model"

@Table
export class Experiment extends Model {
    @Column
    key: string

    @Column
    value: string

    @Column
    userId: number

    @BelongsTo(() => User, "userId")
    user: User
}
