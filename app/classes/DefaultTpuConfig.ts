import cryptoRandomString from "crypto-random-string"

export class DefaultTpuConfig {
  public config: TpuConfig = {
    port: 34582,
    siteName: "TPU",
    hostname: "default.privateuploader.com",
    hostnameWithProtocol: "https://default.privateuploader.com",
    storage: "storage",
    registrations: false,
    mediaProxySecret: cryptoRandomString({ length: 128 }),
    maintenance: false,
    release: "prod",
    jitsiToken: null,
    officialInstance: false,
    finishedSetup: false,
    weatherApiKey: null,
    discord: {
      webhook: null,
      token: null
    },
    providers: {
      tenor: null,
      lastfm: {
        key: null,
        secret: null
      },
      mal: {
        key: null,
        secret: null
      },
      anilist: {
        key: null,
        secret: null
      }
    },
    email: {
      secure: false,
      username: "default",
      password: "",
      from: "default@privateuploader.local",
      host: "localhost",
      port: 25
    },
    redis: {
      host: "defaulthostname",
      port: 6379,
      db: 0
    },
    threads: 0,
    features: {
      communications: true,
      collections: true,
      autoCollects: true,
      workspaces: true,
      insights: true
    },
    defaultPlanId: 1,
    privacyNoteId: null,
    termsNoteId: null,
    inviteAFriend: true
  }
}
