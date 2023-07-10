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
    discord: {
      applicationId: string | undefined | null
      publicKey: string | undefined | null
      oAuthClientId: string | undefined | null
      oAuthClientSecret: string | undefined | null
      oAuthRedirectUri: string | undefined | null
    }
    mal: {
      key: string | undefined | null
      secret: string | undefined | null
    }
    anilist: {
      key: string | undefined | null
      secret: string | undefined | null
    }
    steam: string | undefined | null
    google:
      | {
          service: {
            type: string
            project_id: string
            private_key_id: string
            private_key: string
            client_email: string
            client_id: string
            auth_uri: string
            token_uri: string
            auth_provider_x509_cert_url: string
            client_x509_cert_url: string
            universe_domain: string
          }
          access_token: string
          project_info: {
            project_number: string
            project_id: string
            storage_bucket: string
          }
          client: [
            {
              client_info: {
                mobilesdk_app_id: string
                android_client_info: {
                  package_name: string
                }
              }
              oauth_client: [
                {
                  client_id: string
                  client_type: number
                }
              ]
              api_key: [
                {
                  current_key: string
                }
              ]
              services: {
                appinvite_service: {
                  other_platform_oauth_client: [
                    {
                      client_id: string
                      client_type: number
                    }
                  ]
                }
              }
            }
          ]
          configuration_version: string
        }
      | undefined
      | null
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
  hostnames?: string[]
  preTrustedDomains: string[]
}
