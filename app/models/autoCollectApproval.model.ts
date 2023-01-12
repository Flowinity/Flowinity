import { Table, Column, Model, BelongsTo, Default } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Upload } from "@app/models/upload"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"

@Table
export class AutoCollectApproval extends Model {
  @Column
  autoCollectRuleId: number

  @Column
  uploadId: number

  @Column
  collectionId: number

  @Column
  userId: number

  @Column
  approved: boolean

  @Default([])
  @Column({
    type: "json"
  })
  info: boolean

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @BelongsTo(() => AutoCollectRule, "autoCollectRuleId")
  autoCollectRule: AutoCollectRule

  @BelongsTo(() => Upload, "uploadId")
  attachment: Upload
}
