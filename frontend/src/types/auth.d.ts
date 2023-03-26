export type Login = {
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
};

export type PatchUser = {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  discordPrecache?: boolean;
  darkTheme?: boolean;
  description?: string;
  itemsPerPage?: number;
  themeEngine?: any;
};

export type SessionInfo = {
  accessedFrom: AccessedFrom[];
};

export type AccessedFrom = {
  ip: string;
  userAgent?: string;
  isp?: string;
  location?: string;
  date: string;
  asn: any;
};

export type AlternatePassword = {
  password: string;
  scopes: string;
  totp: boolean;
  name: string;
};
