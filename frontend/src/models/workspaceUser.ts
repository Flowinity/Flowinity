// Import Models
import { Workspace } from "@/models/workspace";
import { User } from "@/models/user";

export interface WorkspaceUser {
  workspaceId: number;
  read: boolean;
  write: boolean;
  configure: boolean;
  accepted: boolean;
  recipientId: number;
  senderId: number;
  identifier: string;
  workspace: Workspace;
  user: User;
  sender: User;
}
