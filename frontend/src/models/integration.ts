import { User } from "@/models/user";

export interface Integration {
  id: number;
  type: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tokenType?: string;
  providerUserId?: string;
  providerUsername?: string;
  providerUserCache?: any;
  user?: User;
  error: string;
}
