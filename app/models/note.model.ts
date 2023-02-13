import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne
} from "sequelize-typescript"
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

  @HasOne(() => WorkspaceFolder, "id")
  folder: WorkspaceFolder
}
