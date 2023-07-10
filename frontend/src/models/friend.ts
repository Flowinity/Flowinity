// Import Models
import { User } from "@/models/user";

export interface Friend {
  status: "incoming" | "outgoing" | "accepted";
  userId: number;
  friendId: number;
  user: User;
  otherUser: User;
  createdAt: Date;
  updatedAt: Date;
}
