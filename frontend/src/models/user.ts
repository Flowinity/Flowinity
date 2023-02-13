export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  passwordResetEnabled: boolean;
  passwordResetCode: string;
  passwordResetExpiry: Date;
  description?: string;
  administrator: boolean;
  darkTheme: boolean;
  banned: boolean;
  inviteId?: number;
  openGraph: OpenGraph;
  discordPrecache: boolean;
  avatar?: string;
  subdomainId?: number;
  domainId: number;
  totpEnable: boolean;
  totpSecret?: string;
  quota: bigint;
  uploadNameHidden: boolean;
  invisibleURLs: boolean;
  moderator: boolean;
  subscriptionId: number;
  fakePath?: string;
  themeId: number;
  itemsPerPage: number;
  banner?: string;
  alternatePasswords?: AlternatePassword[];
  //TODO
  plan: any;
  theme: any;
  domain: any;
  subscription: any;
  collections?: any[];
  scopes: string;
  pendingAutoCollects: number;
  experiments: object;
  friend?: "accepted" | "outgoing" | "incoming" | null;
  friends?: {
    id: number;
    user: User;
    sender: User;
    createdAt: Date;
    updatedAt: Date;
  }[];
  stats?: {};
}
