import {BelongsTo, Column, Model, Table} from "sequelize-typescript"
import {Upload} from "@app/models/upload.model"
import {User} from "@app/models/user.model"

@Table
export class Star extends Model {
  @Column
  userId: number

  @Column
  attachmentId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => Upload, "attachmentId")
  attachment: Upload
}
