declare interface TpuConfig {
  hostnameWithProtocol: string
  hostname: string
  flowinityId: string | undefined | null
  flowinitySecret: string | undefined | null
  maintenance: boolean
  siteName: string
  release: string
  redis: {
    username?: string | undefined
    password?: string | undefined
    host: string
    db: number
    port: number
  }
}
