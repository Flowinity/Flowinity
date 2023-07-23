import { User } from "@/models/user";

export interface Announcement {
  id: number;
  userId: number;
  content: string;
  type: string;
  user: User;
  editing?: boolean;
  createdAt: string;
  updatedAt: string;
  new?: boolean;
}
