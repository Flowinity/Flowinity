import { FieldResolver, Resolver, Root } from "type-graphql"
import { Service } from "typedi"
import { Workspace } from "@app/models/workspace.model"
import { NoteService } from "@app/services/note.service"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { Note } from "@app/models/note.model"

@Resolver(WorkspaceFolder)
@Service()
export class WorkspaceFolderResolver {
  constructor(private workspaceService: NoteService) {}

  @FieldResolver(() => Workspace)
  async workspace(@Root() workspaceFolder: WorkspaceFolder) {
    return workspaceFolder.$get("workspace")
  }

  @FieldResolver(() => [Note])
  async children(@Root() workspaceFolder: WorkspaceFolder) {
    return workspaceFolder.$get("notes")
  }
}
