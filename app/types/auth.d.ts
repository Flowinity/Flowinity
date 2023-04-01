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
  [key: string]: any
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
