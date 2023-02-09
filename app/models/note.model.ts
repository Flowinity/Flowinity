import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript"
import { NoteVersion } from "@app/models/noteVersion.model"

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
}
