import { Table, Column, Model, DataType, BelongsTo } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { NoteDataV2 } from "@app/services/note.service"
import { Note } from "@app/models/note.model"

@Table
export class NoteVersion extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  id: string

  @Column
  noteId: number

  @Column
  userId: number

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  data: NoteDataV2

  @BelongsTo(() => Note, "noteId")
  note: Note

  @BelongsTo(() => User, "userId")
  user: User
}
