import { Workspace } from "@/models/workspace";
import { Note } from "@/models/note";

export interface WorkspaceFolder {
  id: number;
  name: string;
  workspaceId: number;
  folderId: number;
  workspace: Workspace;
  folder: WorkspaceFolder;
  notes: Note[];
  children: Note[];
}
