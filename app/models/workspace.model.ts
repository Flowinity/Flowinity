import {
  Table,
  Column,
  Model,
  BelongsTo,
  HasMany,
  HasOne
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"

@Table
export class Workspace extends Model {
  @Column
  name: string

  @Column
  userId: number

  @Column
  icon: string

  @BelongsTo(() => User, "userId")
  user: User

  @HasMany(() => WorkspaceFolder, "workspaceId")
  folders: WorkspaceFolder[]

  @HasOne(() => WorkspaceFolder, "workspaceId")
  folder: WorkspaceFolder
}
