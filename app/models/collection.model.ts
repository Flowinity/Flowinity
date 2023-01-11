import {
  Table,
  Column,
  Model,
  BelongsTo,
  AllowNull,
  HasMany,
  HasOne
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { CollectionUser } from "@app/models/collectionUser.model"

@Table
export class Collection extends Model {
  @Column
  name: string

  @AllowNull
  @Column
  image: string

  @Column
  userId: number

  @AllowNull
  @Column
  shareLink: string

  @BelongsTo(() => User, "userId")
  user: User

  @HasMany(() => CollectionItem, "collectionId")
  items: CollectionItem[]

  @HasOne(() => CollectionItem, "collectionId")
  preview: CollectionItem

  @HasMany(() => CollectionUser, "collectionId")
  users: CollectionUser[]

  @HasOne(() => CollectionUser, "collectionId")
  recipient: CollectionUser

  //TODO
  /*@HasMany(() => AutoCollectApproval, "collectionId")
  autoCollectApprovals: AutoCollectApproval[]*/
}
