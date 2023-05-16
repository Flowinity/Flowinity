import { User } from "@app/models/user.model"

interface Login {
  user: {
    id: number
    username: string
    email: string
  }
  token: string
}

interface PatchUser {
  username?: string
  email?: string
  password?: string
  currentPassword?: string
  discordPrecache?: boolean
  darkTheme?: boolean
  description?: string
  itemsPerPage?: number
  storedStatus?: typeof User.prototype.storedStatus
  weatherUnit?: typeof User.prototype.weatherUnit
  themeEngine?: typeof User.prototype.themeEngine
  insights?: typeof User.prototype.insights
  profileLayout?: typeof User.prototype.profileLayout
}

interface SessionInfo {
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
