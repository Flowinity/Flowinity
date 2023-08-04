import { User } from "@/models/user";
import { OauthUser } from "@/models/oauthUser";

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
  oauthUsers: OauthUser[];
}
