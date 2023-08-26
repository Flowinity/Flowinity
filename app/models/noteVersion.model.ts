import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { NoteDataV2 } from "@app/services/note.service"
import { Note } from "@app/models/note.model"
import { Field, Float, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { WorkspaceNote } from "@app/classes/graphql/workspaces/note"

@ObjectType()
@Table
export class NoteVersion extends Model {
  @Field()
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  id: string

  @Field()
  @Column
  noteId: number

  @Field(() => Float)
  @Column
  userId: number

  @Field(() => WorkspaceNote, {
    nullable: true
  })
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
