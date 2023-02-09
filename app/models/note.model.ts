import { Table, Column, Model, DataType } from "sequelize-typescript"

type VersionObject = {
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

  @Column(DataType.JSON)
  versions: VersionObject[]
}
