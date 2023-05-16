import {
  BelongsTo,
  Column,
  HasMany,
  HasOne,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { WorkspaceUser } from "@app/models/workspaceUser.model"

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

  @HasOne(() => WorkspaceUser, "workspaceId")
  recipient: WorkspaceUser

  @HasOne(() => WorkspaceUser, "workspaceId")
  sender: WorkspaceUser

  @HasMany(() => WorkspaceUser, "workspaceId")
  users: WorkspaceUser[]
}
