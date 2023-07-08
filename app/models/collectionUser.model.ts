import {AllowNull, BelongsTo, Column, Default, Model, Table, Unique} from "sequelize-typescript"

// Import Models
import {User} from "@app/models/user.model"
import {Collection} from "@app/models/collection.model"

@Table
export class CollectionUser extends Model {
    @Column
    collectionId: number

    @Default(true)
    @Column
    read: boolean

    @Default(true)
    @Column
    write: boolean

    @Default(false)
    @Column
    configure: boolean

    @Default(false)
    @Column
    accepted: boolean

    @Column
    recipientId: number

    @Column
    senderId: number

    @Unique({
        msg: "This user is already in the collection.",
        name: "UNIQUE_COLLECTION_USER_IDENTIFIER"
    })
    @AllowNull
    @Column
    identifier: string

    @BelongsTo(() => Collection, "collectionId")
    collection: Collection

    @BelongsTo(() => User, "recipientId")
    user: User

    @BelongsTo(() => User, "senderId")
    sender: User
}
