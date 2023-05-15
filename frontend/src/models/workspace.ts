import {User} from "@/models/user"
import {WorkspaceFolder} from "@/models/workspaceFolder"
import {WorkspaceUser} from "@/models/workspaceUser"

export interface Workspace {
  id: number;
  name: string;
  userId: number;
  icon: string;
  user: User;
  folders: WorkspaceFolder[];
  folder: WorkspaceFolder;
  recipient: WorkspaceUser;
  sender: WorkspaceUser;
  users: WorkspaceUser[];
}
