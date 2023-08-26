import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript"
import { Workspace } from "@app/models/workspace.model"
import { Note } from "@app/models/note.model"
import { Field, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class WorkspaceFolder extends Model {
  @Field(() => Number)
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

  @Field()
  @Column
  workspaceId: number

  @Field({
    nullable: true
  })
  @Column
  folderId: number

  @BelongsTo(() => Workspace, "workspaceId")
  workspace: Workspace

  @BelongsTo(() => WorkspaceFolder, "folderId")
  folder: WorkspaceFolder

  @HasMany(() => Note, "workspaceFolderId")
  notes: Note[]

  @Field(() => [Note])
  @HasMany(() => Note, "workspaceFolderId")
  children: Note[]
}
