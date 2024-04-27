import { User } from "@/models/user";

export interface ChatAssociation {
  id: number;
  chatId: number;
  userId: number;
  rank: "owner" | "admin" | "member";
  lastRead: number;
  notifications: "all" | "none" | "mentions";
  user: User;
}
