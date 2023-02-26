import { Notification } from "@/models/notification";

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
  quota: number;
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
  domain: {
    id: number;
    domain: string;
    createdAt: Date;
    updatedAt: Date;
  };
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
  stats: {
    uploads: number;
    collections: number;
    collectionItems: number;
    pulse: number;
    docs: number;
    hours: object;
    uploadGraph: {
      labels: string[];
      data: number[];
    };
    uploadGraphAllTime: {
      labels: string[];
      data: number[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
  status: "online" | "offline" | "idle" | "busy";
  storedStatus: "online" | "invisible" | "idle" | "busy";
  notifications: Notification[];
  weatherUnit: "celsius" | "fahrenheit" | "kelvin";
  emailVerified: boolean;
}
