import { User } from "@/models/user";

type InviteFacts = {
  id: number;
  inviteKey: string;
  userId: number;
  user: User;
  status: "pending" | "accepted" | "rejected";
  facts: string[];
  registerUserId: number;
};
