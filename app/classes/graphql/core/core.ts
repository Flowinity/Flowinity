import { Field, ObjectType } from "type-graphql"
import { Announcement } from "@app/models/announcement.model"

@ObjectType()
export class DataLabelsGraph {
  @Field(() => [Number || String])
  data: number[] | string[]
  @Field(() => [String])
  labels: string[]
}

@ObjectType()
export class Stats {
  @Field()
  users: number
  @Field()
  announcements: number
  @Field({
    nullable: true
  })
  usage: number
  @Field()
  collections: number
  @Field()
  collectionItems: number
  @Field(() => DataLabelsGraph)
  uploadGraph: DataLabelsGraph
  @Field(() => DataLabelsGraph)
  messageGraph: DataLabelsGraph
  @Field(() => DataLabelsGraph)
  pulseGraph: DataLabelsGraph
  @Field()
  uploads: number
  @Field()
  pulse: number
  @Field()
  pulses: number
  @Field()
  docs: number
  //TODO
  /*@Field(() => [String], {
    nullable: true
  })
  hours: Record<string, number>*/
}

@ObjectType()
export class CoreStats extends Stats {
  @Field()
  users: number
  @Field()
  announcements: number
  @Field()
  invites: number
  @Field()
  inviteMilestone: number
  @Field()
  messages: number
  @Field()
  chats: number
  @Field(() => [String], {
    nullable: true
  })
  hours: string[]
}

@ObjectType()
export class Maintenance {
  @Field()
  enabled: boolean
  @Field({
    nullable: true
  })
  message: string
  @Field({
    nullable: true
  })
  statusPage: string
}

@ObjectType()
export class Providers {
  @Field()
  anilist: boolean
  @Field()
  lastfm: boolean
  @Field()
  mal: boolean
}

@ObjectType()
export class Features {
  @Field()
  communications: boolean
  @Field()
  collections: boolean
  @Field()
  autoCollects: boolean
  @Field()
  workspaces: boolean
  @Field()
  insights: boolean
}

@ObjectType()
export class Connection {
  @Field(() => String)
  ip: string
  @Field(() => Boolean, {
    deprecationReason: "No longer used in v4."
  })
  whitelist: boolean
}

@ObjectType()
export class CoreState {
  @Field(() => Connection)
  connection: Connection
  @Field()
  name: string
  @Field({
    description: "Whether the app is running in production mode."
  })
  release: "prod" | "dev"
  @Field()
  hostname: string
  @Field()
  hostnameWithProtocol: string
  @Field(() => [Announcement])
  announcements: Announcement[]
  @Field(() => CoreStats)
  stats: Partial<CoreStats>
  @Field(() => Maintenance)
  maintenance: Maintenance
  @Field()
  registrations: boolean
  @Field({
    description:
      "Whether the TPU instance is the officially run instance on privateuploader.com. This can be enabled on any instance but can enable unwanted features."
  })
  officialInstance: boolean
  @Field(() => Providers)
  providers: Providers
  @Field(() => String, {
    nullable: true,
    description: "Workspaces Note ID for the Terms of Service."
  })
  termsNoteId?: string | null
  @Field(() => String, {
    nullable: true,
    description: "Workspaces Note ID for the Privacy Policy."
  })
  privacyNoteId?: string | null
  @Field(() => Features, {
    description: "List of enabled features for TPU instance"
  })
  features: Features
  @Field()
  inviteAFriend: boolean
  @Field(() => [String], {
    description:
      "List of domains that are pre-trusted for user-generated hyperlinks such as Communications messages which don't require a confirmation to proceed."
  })
  preTrustedDomains: string[]
  @Field(() => [String])
  hostnames: string[]
  @Field()
  _redis: string
  @Field()
  server: string
  @Field()
  finishedSetup: boolean
  @Field()
  domain: string
  @Field({
    description: "Uptime of the TPU Server in seconds."
  })
  uptime: number
  @Field({
    description: "Uptime of the system in seconds."
  })
  uptimeSys: number
  @Field()
  commitVersion: string
}
