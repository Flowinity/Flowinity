import { z } from "zod"

export const HostnameValidator = z.string().refine((value) => {
  if (value === "localhost" || value === "tpu") return true
  // Regular expression pattern for valid hostnames
  const hostnameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Check if the value matches the pattern and does not contain a protocol
  return hostnameRegex.test(value) && !value.includes("://")
}, "Invalid hostname")

export const TpuConfigValidator = z.object({
  hostnameWithProtocol: z.string().url(),
  hostname: HostnameValidator,
  maintenance: z.boolean(),
  siteName: z.string(),
  release: z.string(),
  storage: z.string(),
  jitsiToken: z.string().nullable().optional(),
  registrations: z.boolean(),
  mediaProxySecret: z.string(),
  weatherApiKey: z.string().nullable().optional(),
  providers: z.object({
    tenor: z.string().nullable().optional(),
    lastfm: z
      .object({
        key: z.string().nullable().optional(),
        secret: z.string().nullable().optional()
      })
      .nullable()
      .optional(),
    mal: z
      .object({
        key: z.string().nullable().optional(),
        secret: z.string().nullable().optional()
      })
      .nullable()
      .optional(),
    anilist: z
      .object({
        key: z.string().nullable().optional(),
        secret: z.string().nullable().optional()
      })
      .nullable()
      .optional()
  }),
  redis: z.object({
    username: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
    host: z.string(),
    db: z.number(),
    port: z.number()
  }),
  email: z.object({
    secure: z.boolean(),
    username: z.string(),
    password: z.string(),
    from: z.string(),
    host: z.string(),
    port: z.number()
  }),
  discord: z.object({
    webhook: z.string().nullable().optional(),
    token: z.string().nullable().optional()
  }),
  officialInstance: z.boolean(),
  port: z.union([z.number(), z.string().nullable().optional()]),
  finishedSetup: z.boolean(),
  threads: z.number(),
  features: z.object({
    communications: z.boolean(),
    collections: z.boolean(),
    autoCollects: z.boolean(),
    workspaces: z.boolean(),
    insights: z.boolean()
  }),
  defaultPlanId: z.number().nullable().optional(),
  privacyNoteId: z.string().nullable().optional(),
  termsNoteId: z.string().nullable().optional(),
  inviteAFriend: z.boolean(),
  hostnames: z.array(z.string()).optional(),
  preTrustedDomains: z.array(z.string()).optional()
})

export const TpuConfigValidatorPartial = TpuConfigValidator.partial()
