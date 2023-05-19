import { User } from "./user";

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
