import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"

// Import Models
import { User } from "@app/models/user.model"
import { Note } from "@app/models/note.model"

// Import Services
import { NoteDataV2 } from "@app/services/note.service"

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
