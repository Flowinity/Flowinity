declare interface TpuConfig {
  hostnameWithProtocol: string
  hostname: string
  flowinityId: string | undefined | null
  flowinitySecret: string | undefined | null
  maintenance: boolean
  siteName: string
  release: string
  storage: string
  jitsiToken: string
  registrations: boolean
  mediaProxySecret: string
  providers: {
    tenor: string
  }
  redis: {
    username?: string | undefined
    password?: string | undefined
    host: string
    db: number
    port: number
  }
  email: {
    secure: boolean
    username: string
    password: string
    from: string
    host: string
    port: number
  }
  discord: {
    webhook: string
    token: string
  }
}
