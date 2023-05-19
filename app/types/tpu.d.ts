declare type TpuConfig = {
  hostnameWithProtocol: string
  hostname: string
  maintenance: boolean
  siteName: string
  release: string
  storage: string
  jitsiToken: string | undefined | null
  registrations: boolean
  mediaProxySecret: string
  weatherApiKey: string | undefined | null
  providers: {
    tenor: string | undefined | null
    lastfm: {
      key: string | undefined | null
      secret: string | undefined | null
    }
    mal: {
      key: string | undefined | null
      secret: string | undefined | null
    }
    anilist: {
      key: string | undefined | null
      secret: string | undefined | null
    }
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
    webhook: string | undefined | null
    token: string | undefined | null
  }
  officialInstance: boolean
  port: number | string | undefined | null
  finishedSetup: boolean
  threads: number
  features: {
    communications: boolean
    collections: boolean
    autoCollects: boolean
    workspaces: boolean
    insights: boolean
  }
  defaultPlanId?: number
  privacyNoteId?: string | undefined | null
  termsNoteId?: string | undefined | null
  inviteAFriend: boolean
}
