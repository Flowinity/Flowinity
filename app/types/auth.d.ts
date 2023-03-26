import { ThemeEngine } from "@app/models/user.model"

type Login = {
  user: {
    id: number
    username: string
    email: string
  }
  token: string
}

type PatchUser = {
  storedStatus: "online" | "invisible" | "idle" | "busy"
  username?: string
  email?: string
  password?: string
  currentPassword?: string
  discordPrecache?: boolean
  darkTheme?: boolean
  description?: string
  itemsPerPage?: number
  themeEngine?: ThemeEngine | null
}

type SessionInfo = {
  accessedFrom: AccessedFrom[]
}

type AccessedFrom = {
  ip: string
  userAgent?: string
  isp?: string
  location?: string
  date: string
  asn: any
}

type AlternatePassword = {
  password: string
  scopes: string
  totp: boolean
  name: string
}
