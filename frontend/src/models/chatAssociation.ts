import {User} from "@/models/user"

export interface ChatAssociation {
  id: number;
  chatId: number;
  userId: number;
  rank: "owner" | "admin" | "member";
  lastRead: number;
  notifications: "all" | "none" | "mentions";
  legacyUserId: number;
  tpuUser: User | null;
  legacyUser: User | null;
  user: User;
}
