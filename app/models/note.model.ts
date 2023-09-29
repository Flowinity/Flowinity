import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript"
import { NoteVersion } from "@app/models/noteVersion.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { Field, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import {
  NotePermissionsMetadata,
  WorkspaceNote,
  WorkspaceNoteMetadata
} from "@app/classes/graphql/workspaces/note"

export type VersionObject = {
  createdAt: Date
  data: object
  userId: number
  id: string
}

@ObjectType()
@Table
export class Note extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field()
  @Column
  name: string

  @Field(() => WorkspaceNote, {
    nullable: true
  })
  @Column(DataType.JSON)
  data: object

  @Field(() => WorkspaceNoteMetadata, {
    nullable: true
  })
  @Column(DataType.JSON)
  metadata: object

  @Field()
  @Column
  workspaceFolderId: number

  @Field({
    nullable: true
  })
  @Column
  shareLink: string

  @Field(() => [NoteVersion])
  @HasMany(() => NoteVersion, "noteId")
  versions: NoteVersion[]

  @BelongsTo(() => WorkspaceFolder, "workspaceFolderId")
  folder: WorkspaceFolder

  @Field(() => NotePermissionsMetadata, {
    nullable: true
  })
  permissions: NotePermissionsMetadata
}
