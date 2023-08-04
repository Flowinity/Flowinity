import { User } from "@/models/user";

export interface OauthApp {
  id: string;
  name: string;
  icon: string;
  shortCode: string;
  verified: boolean;
  redirectUri: string;
  secret: string;
  description: string;
  scopes: string;
  userId: number;
  private: boolean;
  user: User;
}
