// Import Models
import {User} from "@/models/user";

export class Invite {
  id: number;
  inviteKey: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  userId: number;
  registerUserId: number;
  adminId?: number;
  user: User;
  invited?: User;
}
