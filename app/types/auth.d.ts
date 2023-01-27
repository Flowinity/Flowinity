type Login = {
  user: {
    id: number
    username: string
    email: string
  }
  token: string
}

type PatchUser = {
  username?: string
  email?: string
  password?: string
  currentPassword?: string
  discordPrecache?: boolean
  darkTheme?: boolean
  description?: string
  itemsPerPage?: number
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
