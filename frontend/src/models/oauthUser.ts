import { User } from "@/models/user";

export interface OauthUser {
  id: string;
  userId: number;
  oauthAppId: string;
  active: boolean;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
