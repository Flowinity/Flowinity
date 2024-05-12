import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Note } from "@app/models/note.model"
import { Field, Int, ObjectType } from "type-graphql"
import { WorkspaceNote } from "@app/classes/graphql/workspaces/note"
import { DateType } from "@app/classes/graphql/serializers/date"

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

  @Field(() => Int)
  @Column
  noteId: number

  @Field(() => Int, {
    nullable: true
  })
  @Column
  userId: number

  @Field(() => WorkspaceNote, {
    nullable: true
  })
  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  data: WorkspaceNote

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @BelongsTo(() => Note, "noteId")
  note: Note

  @BelongsTo(() => User, "userId")
  user: User
}
