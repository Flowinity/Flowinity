import {AllowNull, BelongsTo, Column, DataType, Model, Table, Unique} from "sequelize-typescript"

// Import Models
import {User} from "@app/models/user.model"
import {Collection} from "@app/models/collection.model"
import {Upload} from "@app/models/upload.model"

@Table
export class CollectionItem extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number
    @Column
    collectionId: number

    @Column
    attachmentId: number

    @Column
    userId: number

    @Unique
    @AllowNull
    @Column
    identifier: string

    @Column({
        type: DataType.BOOLEAN
    })
    pinned: boolean

    @BelongsTo(() => User, "userId")
    user: User

    // associate collectionItem with collection
    @BelongsTo(() => Collection, "collectionId")
    collection: Collection

    @BelongsTo(() => Upload, "attachmentId")
    attachment: Upload
}
