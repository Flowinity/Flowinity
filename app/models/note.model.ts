import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript"

// Import Models
import { NoteVersion } from "@app/models/noteVersion.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"

export type VersionObject = {
  createdAt: Date
  data: object
  userId: number
  id: string
}

@Table
export class Note extends Model {
  @Column
  name: string

  @Column(DataType.JSON)
  data: object

  @Column(DataType.JSON)
  metadata: object

  @Column
  workspaceFolderId: number

  @Column
  shareLink: string

  @HasMany(() => NoteVersion, "noteId")
  versions: NoteVersion[]

  @BelongsTo(() => WorkspaceFolder, "workspaceFolderId")
  folder: WorkspaceFolder
}
