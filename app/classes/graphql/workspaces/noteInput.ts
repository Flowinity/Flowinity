import { Field, InputType, registerEnumType } from "type-graphql"
import { WorkspaceNote } from "@app/classes/graphql/workspaces/note"

export enum WorkspaceItemType {
  NOTE = "note",
  FOLDER = "folder",
  WORKSPACE = "workspace"
}

registerEnumType(WorkspaceItemType, {
  name: "WorkspaceItemType",
  description: "The type of workspace item"
})

@InputType()
export class NoteInput {
  @Field({
    nullable: true
  })
  id?: number
  @Field({
    nullable: true
  })
  shareLink?: string
}

@InputType()
export class SaveNoteInput {
  @Field()
  id: number
  @Field(() => WorkspaceNote)
  data: WorkspaceNote
  @Field({
    nullable: true
  })
  manualSave: boolean
  @Field({
    nullable: true
  })
  name: string
}

@InputType()
export class CreateNoteInput {
  @Field()
  workspaceFolderId: number
  @Field()
  name: string
}

@InputType()
export class CreateWorkspaceFolderInput {
  @Field()
  name: string
  @Field()
  workspaceId: number
}

@InputType()
export class DeleteWorkspaceItemInput {
  @Field()
  id: number
  @Field(() => WorkspaceItemType)
  type: WorkspaceItemType
}
