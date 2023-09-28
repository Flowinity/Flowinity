import { Announcement } from "@app/models/announcement.model"

type State =
  | {
      name: string
      release: string
      hostname: string
      hostnameWithProtocol: string
      announcements: Announcement[]
      stats: Partial<Stats>
      maintenance: Maintenance
      registrations: boolean
      officialInstance: boolean
      providers: Providers
      termsNoteId?: string | null
      privacyNoteId?: string | null
      features: Features
      inviteAFriend: boolean
      preTrustedDomains: string[]
      hostnames: string[]
      _redis: string
      server: string
      connection: Connection
      finishedSetup: boolean
      domain: string
    }
  | {
      finishedSetup: boolean
      name: string
      step: number
      dbHost: string
      redisHost: string
    }

interface Stats {
  users: number
  announcements: number
  usage: number
  usagePercentage: number
  collections: number
  collectionItems: number
  uploadGraph: DataLabelsGraph
  messageGraph: DataLabelsGraph
  pulseGraph: DataLabelsGraph
  uploads: number
  invites: number
  inviteMilestone: number
  pulse: number
  pulses: number
  docs: number
  messages: number
  chats: number
  hours: Record<string, number>
}

export interface DataLabelsGraph {
  data: number[] | unknown[]
  labels: string[]
}

export interface Maintenance {
  enabled: boolean
  statusPage: string
  message: string
}

export interface Providers {
  anilist: boolean
  lastfm: boolean
  mal: boolean
}

export interface Features {
  communications: boolean
  collections: boolean
  autoCollects: boolean
  workspaces: boolean
  insights: boolean
}

export interface Connection {
  ip: string
  whitelist: boolean
}
