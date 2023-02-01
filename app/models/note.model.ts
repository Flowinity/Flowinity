import { Table, Column, Model, DataType } from "sequelize-typescript"

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
}
