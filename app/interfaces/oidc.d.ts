export type OidcTokenBody = {
  grant_type: string
  client_id: string
  client_secret: string
  code: string
  redirect_uri: string
}

export type IdentityToken = {
  iss: string
  sub: string
  aud: string
  exp?: number
  iat?: number
  name?: string
  email?: string
  picture?: string
  preferred_username?: string
  tpu_administrator?: boolean
  tpu_moderator?: boolean
  tpu_subscription?: string
  created_at?: Date
  tpu_has_gold?: boolean
}
