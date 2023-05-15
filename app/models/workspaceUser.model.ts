import {BelongsTo, Column, Model, Table, Unique} from "sequelize-typescript"
import {Workspace} from "@app/models/workspace.model"
import {User} from "@app/models/user.model"

@Table
export class WorkspaceUser extends Model {
  @Column
  workspaceId: number

  @Column
  read: boolean

  @Column
  write: boolean

  @Column
  configure: boolean

  @Column
  accepted: boolean

  @Column
  recipientId: number

  @Column
  senderId: number

  @Unique
  @Column
  identifier: string

  @BelongsTo(() => Workspace, "workspaceId")
  workspace: Workspace

  @BelongsTo(() => User, "recipientId")
  user: User

  @BelongsTo(() => User, "senderId")
  sender: User
}
