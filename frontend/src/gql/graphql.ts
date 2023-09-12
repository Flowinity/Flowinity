/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** File custom scalar type */
  File: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AccessedFrom = {
  __typename?: 'AccessedFrom';
  asn?: Maybe<Scalars['Float']['output']>;
  date: Scalars['String']['output'];
  ip: Scalars['String']['output'];
  isp?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type AlternatePassword = {
  __typename?: 'AlternatePassword';
  name: Scalars['String']['output'];
  scopes: Scalars['String']['output'];
  totp: Scalars['Boolean']['output'];
};

export type Announcement = {
  __typename?: 'Announcement';
  content: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  type?: Maybe<Scalars['String']['output']>;
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type AutoCollectApproval = {
  __typename?: 'AutoCollectApproval';
  approved: Scalars['Boolean']['output'];
  attachment?: Maybe<Upload>;
  autoCollectRule?: Maybe<AutoCollectRule>;
  autoCollectRuleId: Scalars['Float']['output'];
  collection?: Maybe<Collection>;
  collectionId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  uploadId: Scalars['Float']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Float']['output'];
};

export type AutoCollectParentRule = {
  __typename?: 'AutoCollectParentRule';
  id: Scalars['Float']['output'];
  rules: Array<SubRule>;
};

export type AutoCollectRule = {
  __typename?: 'AutoCollectRule';
  collectionId: Scalars['Float']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  requireApproval: Scalars['Boolean']['output'];
  rules: Array<AutoCollectParentRule>;
};

export type Badge = {
  __typename?: 'Badge';
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  plan: Plan;
  priority?: Maybe<Scalars['Float']['output']>;
  tooltip?: Maybe<Scalars['String']['output']>;
  unlocked: Scalars['Boolean']['output'];
  users: Array<PartialUserBase>;
};

export type Chat = {
  __typename?: 'Chat';
  _redisSortDate: Scalars['String']['output'];
  association?: Maybe<ChatAssociation>;
  createdAt: Scalars['DateTimeISO']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  /**
   * This is used if the chat is owned by a Colubrina legacy user.
   * @deprecated Use user instead.
   */
  legacyUser?: Maybe<PartialUserBase>;
  /**
   * This is used if the chat is owned by a Colubrina legacy user.
   * @deprecated Use userId instead.
   */
  legacyUserId?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  recipient?: Maybe<PartialUserBase>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  /** Null if the chat is owned by a Colubrina legacy user, or the account was deleted. */
  user?: Maybe<PartialUserBase>;
  /** Null if the chat is owned by a Colubrina legacy user, or the account was deleted. */
  userId?: Maybe<Scalars['Float']['output']>;
  users: Array<ChatAssociation>;
};

export type ChatAssociation = {
  __typename?: 'ChatAssociation';
  chatId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  lastRead?: Maybe<Scalars['Float']['output']>;
  /**
   * Used for legacy Colubrina accounts.
   * @deprecated Use `user` instead.
   */
  legacyUser?: Maybe<PartialUserBase>;
  /**
   * Used for legacy Colubrina accounts.
   * @deprecated Use `userId` instead.
   */
  legacyUserId?: Maybe<Scalars['Float']['output']>;
  notifications: Scalars['String']['output'];
  rank: Scalars['String']['output'];
  /** Used for user virtual which falls back to a Colubrina account. */
  tpuUser?: Maybe<PartialUserBase>;
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Float']['output']>;
};

export type Collection = {
  __typename?: 'Collection';
  attachments: Array<Upload>;
  autoCollectApprovals: Array<AutoCollectApproval>;
  id: Scalars['Float']['output'];
  image?: Maybe<Scalars['String']['output']>;
  itemCount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  permissionsMetadata: PermissionsMetadata;
  preview?: Maybe<CollectionItem>;
  recipient?: Maybe<CollectionUser>;
  shareLink?: Maybe<Scalars['String']['output']>;
  shared?: Maybe<Scalars['Boolean']['output']>;
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
  users: Array<CollectionUser>;
};

/** The type of collection */
export enum CollectionFilter {
  All = 'ALL',
  Configure = 'CONFIGURE',
  Owned = 'OWNED',
  Read = 'READ',
  Shared = 'SHARED',
  Write = 'WRITE'
}

export type CollectionInput = {
  id?: InputMaybe<Scalars['Float']['input']>;
  shareLink?: InputMaybe<Scalars['String']['input']>;
};

export type CollectionItem = {
  __typename?: 'CollectionItem';
  attachment: Upload;
  attachmentId: Scalars['Float']['output'];
  collection: Collection;
  collectionId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  /** Used to prevent duplicates by forming `uploadId-collectionId`. Can be null for items created before October 2022. */
  identifier?: Maybe<Scalars['String']['output']>;
  pinned: Scalars['Boolean']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type CollectionUser = {
  __typename?: 'CollectionUser';
  accepted: Scalars['Boolean']['output'];
  collection?: Maybe<Collection>;
  collectionId: Scalars['Float']['output'];
  configure: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Float']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  read: Scalars['Boolean']['output'];
  recipientId?: Maybe<Scalars['Float']['output']>;
  sender?: Maybe<PartialUserBase>;
  senderId?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  write: Scalars['Boolean']['output'];
};

export type CoreState = {
  __typename?: 'CoreState';
  _redis: Scalars['String']['output'];
  announcements: Array<Announcement>;
  commitVersion: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  /** List of enabled features for TPU instance */
  features: Features;
  finishedSetup: Scalars['Boolean']['output'];
  hostname: Scalars['String']['output'];
  hostnameWithProtocol: Scalars['String']['output'];
  hostnames: Array<Scalars['String']['output']>;
  inviteAFriend: Scalars['Boolean']['output'];
  maintenance: Maintenance;
  name: Scalars['String']['output'];
  /** Whether the TPU instance is the officially run instance on privateuploader.com. This can be enabled on any instance but can enable unwanted features. */
  officialInstance: Scalars['Boolean']['output'];
  /** List of domains that are pre-trusted for user-generated hyperlinks such as Communications messages which don't require a confirmation to proceed. */
  preTrustedDomains: Array<Scalars['String']['output']>;
  /** Workspaces Note ID for the Privacy Policy. */
  privacyNoteId?: Maybe<Scalars['String']['output']>;
  providers: Providers;
  registrations: Scalars['Boolean']['output'];
  /** Whether the app is running in production mode. */
  release: Scalars['String']['output'];
  server: Scalars['String']['output'];
  stats: CoreStats;
  /** Workspaces Note ID for the Terms of Service. */
  termsNoteId?: Maybe<Scalars['String']['output']>;
  /** Uptime of the TPU Server in seconds. */
  uptime: Scalars['Float']['output'];
  /** Uptime of the system in seconds. */
  uptimeSys: Scalars['Float']['output'];
  weather: Weather;
};

export type CoreStats = {
  __typename?: 'CoreStats';
  announcements: Scalars['Float']['output'];
  chats: Scalars['Float']['output'];
  collectionItems: Scalars['Float']['output'];
  collections: Scalars['Float']['output'];
  docs: Scalars['Float']['output'];
  hours?: Maybe<Array<Scalars['String']['output']>>;
  inviteMilestone: Scalars['Float']['output'];
  invites: Scalars['Float']['output'];
  messageGraph: DataLabelsGraph;
  messages: Scalars['Float']['output'];
  pulse: Scalars['Float']['output'];
  pulseGraph: DataLabelsGraph;
  pulses: Scalars['Float']['output'];
  uploadGraph: DataLabelsGraph;
  uploads: Scalars['Float']['output'];
  usage: Scalars['Float']['output'];
  users: Scalars['Float']['output'];
};

export type CreateNoteInput = {
  name: Scalars['String']['input'];
  workspaceFolderId: Scalars['Float']['input'];
};

export type CreateWorkspaceFolderInput = {
  name: Scalars['String']['input'];
  workspaceId: Scalars['Float']['input'];
};

export type DataLabelsGraph = {
  __typename?: 'DataLabelsGraph';
  data: Array<Scalars['Float']['output']>;
  labels: Array<Scalars['String']['output']>;
};

export type DeleteWorkspaceItemInput = {
  id: Scalars['Float']['input'];
  type: WorkspaceItemType;
};

export type Domain = {
  __typename?: 'Domain';
  /** @deprecated Use `active` instead. */
  DNSProvisioned: Scalars['Boolean']['output'];
  active: Scalars['Boolean']['output'];
  /** @deprecated Cloudflare integration was removed in TPUv2. */
  advanced?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Granular user control was removed in TPUv2. */
  customUserEligibility?: Maybe<Array<Scalars['Int']['output']>>;
  domain: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  /** @deprecated Granular user control was removed in TPUv2. */
  restricted: Scalars['String']['output'];
  /** @deprecated Subdomains were removed in TPUv2. */
  subdomains: Scalars['Boolean']['output'];
  /** @deprecated Subdomains were removed in TPUv2. */
  subdomainsCreate: Scalars['Boolean']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
  /** Only populated in some admin contexts */
  users?: Maybe<Array<PartialUserBase>>;
  /** @deprecated Cloudflare integration was removed in TPUv2. */
  zone?: Maybe<Scalars['String']['output']>;
};

export type Embed = {
  __typename?: 'Embed';
  data?: Maybe<EmbedData>;
  type: Scalars['String']['output'];
};

export type EmbedData = {
  __typename?: 'EmbedData';
  description?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  siteName?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  upload?: Maybe<Upload>;
  url?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type Experiment = {
  __typename?: 'Experiment';
  key: Scalars['String']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
  value: Scalars['String']['output'];
};

export type ExperimentType = {
  __typename?: 'ExperimentType';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  refresh?: Maybe<Scalars['Boolean']['output']>;
  value: Scalars['Float']['output'];
};

export type Features = {
  __typename?: 'Features';
  autoCollects: Scalars['Boolean']['output'];
  collections: Scalars['Boolean']['output'];
  communications: Scalars['Boolean']['output'];
  insights: Scalars['Boolean']['output'];
  workspaces: Scalars['Boolean']['output'];
};

export type Friend = {
  __typename?: 'Friend';
  createdAt: Scalars['Date']['output'];
  friendId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  otherUser: PartialUserFriend;
  status: FriendStatus;
  updatedAt: Scalars['Date']['output'];
  user: PartialUserFriend;
  userId: Scalars['Float']['output'];
};

export type FriendNickname = {
  __typename?: 'FriendNickname';
  friend: PartialUserBase;
  friendId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  nickname: Scalars['String']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

/** Friend request status. */
export enum FriendStatus {
  Accepted = 'ACCEPTED',
  Incoming = 'INCOMING',
  None = 'NONE',
  Outgoing = 'OUTGOING'
}

/** The filter to apply to the gallery request */
export enum GalleryFilter {
  All = 'ALL',
  Audio = 'AUDIO',
  Gifs = 'GIFS',
  Images = 'IMAGES',
  IncludeDeletable = 'INCLUDE_DELETABLE',
  IncludeMetadata = 'INCLUDE_METADATA',
  NoCollection = 'NO_COLLECTION',
  Other = 'OTHER',
  Owned = 'OWNED',
  Paste = 'PASTE',
  Shared = 'SHARED',
  Text = 'TEXT',
  Videos = 'VIDEOS'
}

export type GalleryInput = {
  advanced?: InputMaybe<Array<SearchModeInput>>;
  /** Requires Type to be COLLECTION */
  collectionId?: InputMaybe<Scalars['Float']['input']>;
  filters?: InputMaybe<Array<GalleryFilter>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  order?: InputMaybe<GalleryOrder>;
  page?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  /** Requires Type to be COLLECTION */
  shareLink?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<GallerySort>;
  type?: InputMaybe<GalleryType>;
};

/** The order to apply to the gallery request */
export enum GalleryOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** The advanced search mode. */
export enum GallerySearchMode {
  After = 'AFTER',
  Before = 'BEFORE',
  Collection = 'COLLECTION',
  During = 'DURING',
  Meta = 'META',
  Name = 'NAME',
  Size = 'SIZE',
  Type = 'TYPE',
  User = 'USER'
}

/** The sort to apply to the gallery request */
export enum GallerySort {
  CreatedAt = 'CREATED_AT',
  Name = 'NAME',
  Size = 'SIZE',
  UpdatedAt = 'UPDATED_AT'
}

/** The type of gallery request, for example if it's the personal gallery page, or a Collection */
export enum GalleryType {
  Collection = 'COLLECTION',
  Personal = 'PERSONAL',
  Starred = 'STARRED'
}

export type InfiniteMessagesInput = {
  associationId: Scalars['Float']['input'];
  limit?: Scalars['Float']['input'];
  offset?: InputMaybe<Scalars['Float']['input']>;
  position?: InputMaybe<ScrollPosition>;
  search?: InputMaybe<MessagesSearch>;
};

export type Integration = {
  __typename?: 'Integration';
  error?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['Float']['output'];
  providerUserId?: Maybe<Scalars['Float']['output']>;
  providerUsername?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  /** TOTP/2FA code if enabled. */
  totp?: InputMaybe<Scalars['String']['input']>;
  /** Username or email */
  username: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
  user: LoginUser;
};

export type LoginUser = {
  __typename?: 'LoginUser';
  email: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  username: Scalars['String']['output'];
};

export type Maintenance = {
  __typename?: 'Maintenance';
  enabled: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  statusPage?: Maybe<Scalars['String']['output']>;
};

export type Message = {
  __typename?: 'Message';
  chat: Chat;
  chatId: Scalars['Float']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  edited: Scalars['Boolean']['output'];
  editedAt?: Maybe<Scalars['Date']['output']>;
  embeds: Array<Embed>;
  id: Scalars['Float']['output'];
  legacyUser?: Maybe<PartialUserBase>;
  legacyUserId?: Maybe<Scalars['Float']['output']>;
  pinned: Scalars['Boolean']['output'];
  readReceipts: Array<ChatAssociation>;
  reply?: Maybe<Message>;
  replyId?: Maybe<Scalars['Float']['output']>;
  tpuUser?: Maybe<PartialUserBase>;
  type?: Maybe<MessageType>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Float']['output']>;
};

/** The type of message. Can be null for legacy (Colubrina) messages where `MESSAGE` should be inferred. */
export enum MessageType {
  Administrator = 'ADMINISTRATOR',
  Join = 'JOIN',
  Leave = 'LEAVE',
  Message = 'MESSAGE',
  Pin = 'PIN',
  Rename = 'RENAME',
  System = 'SYSTEM'
}

export type MessagesSearch = {
  after?: InputMaybe<Scalars['Date']['input']>;
  before?: InputMaybe<Scalars['Date']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['Float']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNote: Note;
  /** Create workspace */
  createWorkspace: Workspace;
  /** Create a new Workspace Folder. */
  createWorkspaceFolder: WorkspaceFolder;
  /** Delete a Note. */
  deleteWorkspaceItem: Scalars['Boolean']['output'];
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  register: LoginResponse;
  saveNote: Note;
  sendMessage: Message;
  /** Toggle the ShareLink for a Note. */
  toggleNoteShare: Note;
  updateUser: Scalars['Boolean']['output'];
  upload: Upload;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationCreateWorkspaceArgs = {
  input: Scalars['String']['input'];
};


export type MutationCreateWorkspaceFolderArgs = {
  input: CreateWorkspaceFolderInput;
};


export type MutationDeleteWorkspaceItemArgs = {
  input: DeleteWorkspaceItemInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSaveNoteArgs = {
  input: SaveNoteInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationToggleNoteShareArgs = {
  input: Scalars['Int']['input'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUploadArgs = {
  file: Scalars['File']['input'];
};

export type Note = {
  __typename?: 'Note';
  createdAt: Scalars['Date']['output'];
  data?: Maybe<WorkspaceNote>;
  id: Scalars['Float']['output'];
  metadata?: Maybe<WorkspaceNoteMetadata>;
  name: Scalars['String']['output'];
  permissions?: Maybe<NotePermissionsMetadata>;
  shareLink?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  versions: Array<NoteVersion>;
  workspaceFolderId: Scalars['Float']['output'];
};

export type NoteInput = {
  id?: InputMaybe<Scalars['Float']['input']>;
  shareLink?: InputMaybe<Scalars['String']['input']>;
};

export type NotePermissionsMetadata = {
  __typename?: 'NotePermissionsMetadata';
  configure: Scalars['Boolean']['output'];
  modify: Scalars['Boolean']['output'];
  read: Scalars['Boolean']['output'];
};

export type NoteVersion = {
  __typename?: 'NoteVersion';
  data?: Maybe<WorkspaceNote>;
  id: Scalars['String']['output'];
  noteId: Scalars['Float']['output'];
  userId: Scalars['Float']['output'];
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['Date']['output'];
  dismissed: Scalars['Boolean']['output'];
  id: Scalars['Float']['output'];
  message: Scalars['String']['output'];
  route?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Float']['output'];
};

export type PagedMessagesInput = {
  associationId: Scalars['Float']['input'];
  limit?: Scalars['Float']['input'];
  page?: Scalars['Float']['input'];
  position?: InputMaybe<ScrollPosition>;
  search?: InputMaybe<MessagesSearch>;
};

export type Pager = {
  __typename?: 'Pager';
  currentPage: Scalars['Float']['output'];
  endIndex: Scalars['Float']['output'];
  endPage: Scalars['Float']['output'];
  pageSize: Scalars['Float']['output'];
  pages: Array<Scalars['Float']['output']>;
  startIndex: Scalars['Float']['output'];
  startPage: Scalars['Float']['output'];
  totalItems: Scalars['Float']['output'];
  totalPages: Scalars['Float']['output'];
};

export type PaginatedCollectionResponse = {
  __typename?: 'PaginatedCollectionResponse';
  items: Array<Collection>;
  pager: Pager;
};

export type PaginatedMessageResponse = {
  __typename?: 'PaginatedMessageResponse';
  items: Array<Message>;
  pager: Pager;
};

export type PaginatedUploadResponse = {
  __typename?: 'PaginatedUploadResponse';
  items: Array<Upload>;
  pager: Pager;
};

export type PartialUserBase = {
  __typename?: 'PartialUserBase';
  administrator: Scalars['Boolean']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['Float']['output'];
  moderator: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
};

export type PartialUserFriend = {
  __typename?: 'PartialUserFriend';
  administrator: Scalars['Boolean']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['Float']['output'];
  moderator: Scalars['Boolean']['output'];
  status: UserStatus;
  username: Scalars['String']['output'];
};

export type PartialUserPublic = {
  __typename?: 'PartialUserPublic';
  administrator: Scalars['Boolean']['output'];
  autoCollectRules: AutoCollectRule;
  avatar?: Maybe<Scalars['String']['output']>;
  badges: Array<Badge>;
  banned: Scalars['Boolean']['output'];
  banner?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  domain: Array<Domain>;
  friend?: Maybe<FriendStatus>;
  friends?: Maybe<Array<Friend>>;
  id: Scalars['Float']['output'];
  insights: UserInsights;
  integrations: Array<Integration>;
  moderator: Scalars['Boolean']['output'];
  notifications: Array<Notification>;
  plan: Plan;
  platforms?: Maybe<Array<Platform>>;
  profileLayout?: Maybe<ProfileLayout>;
  publicProfile: Scalars['Boolean']['output'];
  quota: Scalars['Float']['output'];
  stats?: Maybe<Stats>;
  subscription: Array<TpuSubscription>;
  themeEngine?: Maybe<ThemeEngine>;
  username: Scalars['String']['output'];
  xp?: Maybe<Scalars['Float']['output']>;
};

export type PermissionsMetadata = {
  __typename?: 'PermissionsMetadata';
  configure: Scalars['Boolean']['output'];
  read: Scalars['Boolean']['output'];
  write: Scalars['Boolean']['output'];
};

export type Plan = {
  __typename?: 'Plan';
  color?: Maybe<Scalars['String']['output']>;
  /** @deprecated Plans are unused in TPUv2+. */
  features?: Maybe<Scalars['String']['output']>;
  icon: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  internalFeatures?: Maybe<Scalars['String']['output']>;
  internalName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  price: Scalars['Float']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  purchasable: Scalars['Boolean']['output'];
  quotaMax: Scalars['Float']['output'];
};

export type Platform = {
  __typename?: 'Platform';
  id: Scalars['String']['output'];
  lastSeen: Scalars['String']['output'];
  platform: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type ProfileLayout = {
  __typename?: 'ProfileLayout';
  config: ProfileLayoutConfig;
  layout: ProfileLayoutObject;
  version: Scalars['Float']['output'];
};

export type ProfileLayoutColumn = {
  __typename?: 'ProfileLayoutColumn';
  rows: Array<ProfileLayoutComponent>;
};

export type ProfileLayoutColumnInput = {
  rows: Array<ProfileLayoutComponentInput>;
};

export type ProfileLayoutComponent = {
  __typename?: 'ProfileLayoutComponent';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  props?: Maybe<ProfileLayoutProps>;
};

export type ProfileLayoutComponentInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  props?: InputMaybe<ProfileLayoutPropsInput>;
};

export type ProfileLayoutConfig = {
  __typename?: 'ProfileLayoutConfig';
  containerMargin?: Maybe<Scalars['Float']['output']>;
  showStatsSidebar: Scalars['Boolean']['output'];
};

export type ProfileLayoutConfigInput = {
  containerMargin?: InputMaybe<Scalars['Float']['input']>;
  showStatsSidebar: Scalars['Boolean']['input'];
};

export type ProfileLayoutInput = {
  config: ProfileLayoutConfigInput;
  layout: ProfileLayoutObjectInput;
  version: Scalars['Float']['input'];
};

export type ProfileLayoutObject = {
  __typename?: 'ProfileLayoutObject';
  columns: Array<ProfileLayoutColumn>;
};

export type ProfileLayoutObjectInput = {
  columns: Array<ProfileLayoutColumnInput>;
};

export type ProfileLayoutPropLink = {
  __typename?: 'ProfileLayoutPropLink';
  color: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ProfileLayoutPropLinkInput = {
  color: Scalars['String']['input'];
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type ProfileLayoutProps = {
  __typename?: 'ProfileLayoutProps';
  children?: Maybe<Array<ProfileLayoutComponent>>;
  display?: Maybe<Scalars['Float']['output']>;
  friendsOnly?: Maybe<Scalars['Boolean']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  links?: Maybe<Array<ProfileLayoutPropLink>>;
  type?: Maybe<Scalars['String']['output']>;
};

export type ProfileLayoutPropsInput = {
  children?: InputMaybe<Array<ProfileLayoutComponentInput>>;
  display?: InputMaybe<Scalars['Float']['input']>;
  friendsOnly?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  links?: InputMaybe<Array<ProfileLayoutPropLinkInput>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Providers = {
  __typename?: 'Providers';
  anilist: Scalars['Boolean']['output'];
  lastfm: Scalars['Boolean']['output'];
  mal: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  chats: Array<Chat>;
  collection?: Maybe<Collection>;
  collections?: Maybe<PaginatedCollectionResponse>;
  coreState: CoreState;
  currentUser?: Maybe<User>;
  domains: Array<Domain>;
  experiments: Array<ExperimentType>;
  friends: Array<Friend>;
  gallery: PaginatedUploadResponse;
  messages: Array<Message>;
  messagesPaged: PaginatedMessageResponse;
  note?: Maybe<Note>;
  setupStep: Scalars['Float']['output'];
  user: PartialUserPublic;
  weather: Weather;
  workspaces: Array<Workspace>;
};


export type QueryCollectionArgs = {
  input: CollectionInput;
};


export type QueryCollectionsArgs = {
  input?: InputMaybe<UserCollectionsInput>;
};


export type QueryGalleryArgs = {
  input: GalleryInput;
};


export type QueryMessagesArgs = {
  input: InfiniteMessagesInput;
};


export type QueryMessagesPagedArgs = {
  input: PagedMessagesInput;
};


export type QueryNoteArgs = {
  input: NoteInput;
};


export type QueryUserArgs = {
  input: UserProfileInput;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  inviteKey?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type SaveNoteInput = {
  data: WorkspaceNoteInput;
  id: Scalars['Float']['input'];
  manualSave?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** The position to retrieve messages from based on the `offset`. */
export enum ScrollPosition {
  Bottom = 'BOTTOM',
  Top = 'TOP'
}

export type SearchModeInput = {
  mode: GallerySearchMode;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type SendMessageInput = {
  associationId: Scalars['Float']['input'];
  attachments?: Array<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  replyId?: InputMaybe<Scalars['Float']['input']>;
};

export type Session = {
  __typename?: 'Session';
  expiredAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['Float']['output'];
  info?: Maybe<SessionInfo>;
  name?: Maybe<Scalars['String']['output']>;
  oauthAppId?: Maybe<Scalars['String']['output']>;
  scopes: Scalars['String']['output'];
  type: Scalars['String']['output'];
  userId: Scalars['Float']['output'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  accessedFrom: Array<AccessedFrom>;
};

export type Star = {
  __typename?: 'Star';
  attachment: Upload;
  attachmentId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type Stats = {
  __typename?: 'Stats';
  announcements: Scalars['Float']['output'];
  collectionItems: Scalars['Float']['output'];
  collections: Scalars['Float']['output'];
  docs: Scalars['Float']['output'];
  messageGraph: DataLabelsGraph;
  pulse: Scalars['Float']['output'];
  pulseGraph: DataLabelsGraph;
  pulses: Scalars['Float']['output'];
  uploadGraph: DataLabelsGraph;
  uploads: Scalars['Float']['output'];
  usage: Scalars['Float']['output'];
  users: Scalars['Float']['output'];
};

export type SubRule = {
  __typename?: 'SubRule';
  id: Scalars['Float']['output'];
  operator: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type SubscriptionMetadata = {
  __typename?: 'SubscriptionMetadata';
  hours: Scalars['Float']['output'];
};

export type TpuSubscription = {
  __typename?: 'TPUSubscription';
  cancelled: Scalars['Boolean']['output'];
  cancelledAt: Scalars['DateTimeISO']['output'];
  expiredAt: Scalars['DateTimeISO']['output'];
  metadata: SubscriptionMetadata;
  paymentId: Scalars['Float']['output'];
  planId: Scalars['Float']['output'];
  price: Scalars['Float']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type ThemeEngine = {
  __typename?: 'ThemeEngine';
  baseTheme: Scalars['String']['output'];
  customCSS?: Maybe<Scalars['String']['output']>;
  defaults?: Maybe<ThemeEngineThemes>;
  deviceSync: Scalars['Boolean']['output'];
  fluidGradient: Scalars['Boolean']['output'];
  gradientOffset: Scalars['String']['output'];
  showOnProfile: Scalars['Boolean']['output'];
  theme: ThemeEngineThemes;
  version: Scalars['Float']['output'];
};

export type ThemeEngineColors = {
  __typename?: 'ThemeEngineColors';
  accent: Scalars['String']['output'];
  background: Scalars['String']['output'];
  background2: Scalars['String']['output'];
  card: Scalars['String']['output'];
  dark: Scalars['String']['output'];
  error: Scalars['String']['output'];
  gold: Scalars['String']['output'];
  info: Scalars['String']['output'];
  logo1: Scalars['String']['output'];
  logo2: Scalars['String']['output'];
  primary: Scalars['String']['output'];
  secondary: Scalars['String']['output'];
  sheet: Scalars['String']['output'];
  success: Scalars['String']['output'];
  text: Scalars['String']['output'];
  toolbar: Scalars['String']['output'];
  warning: Scalars['String']['output'];
};

export type ThemeEngineColorsInput = {
  accent: Scalars['String']['input'];
  background: Scalars['String']['input'];
  background2: Scalars['String']['input'];
  card: Scalars['String']['input'];
  dark: Scalars['String']['input'];
  error: Scalars['String']['input'];
  gold: Scalars['String']['input'];
  info: Scalars['String']['input'];
  logo1: Scalars['String']['input'];
  logo2: Scalars['String']['input'];
  primary: Scalars['String']['input'];
  secondary: Scalars['String']['input'];
  sheet: Scalars['String']['input'];
  success: Scalars['String']['input'];
  text: Scalars['String']['input'];
  toolbar: Scalars['String']['input'];
  warning: Scalars['String']['input'];
};

export type ThemeEngineInput = {
  baseTheme: Scalars['String']['input'];
  customCSS?: InputMaybe<Scalars['String']['input']>;
  defaults?: InputMaybe<ThemeEngineThemesInput>;
  deviceSync: Scalars['Boolean']['input'];
  fluidGradient: Scalars['Boolean']['input'];
  gradientOffset: Scalars['String']['input'];
  showOnProfile: Scalars['Boolean']['input'];
  theme: ThemeEngineThemesInput;
  version: Scalars['Float']['input'];
};

export type ThemeEngineTheme = {
  __typename?: 'ThemeEngineTheme';
  colors: ThemeEngineColors;
  dark?: Maybe<Scalars['Boolean']['output']>;
};

export type ThemeEngineThemeInput = {
  colors: ThemeEngineColorsInput;
  dark?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ThemeEngineThemes = {
  __typename?: 'ThemeEngineThemes';
  amoled: ThemeEngineTheme;
  dark: ThemeEngineTheme;
  light: ThemeEngineTheme;
};

export type ThemeEngineThemesInput = {
  amoled: ThemeEngineThemeInput;
  dark: ThemeEngineThemeInput;
  light: ThemeEngineThemeInput;
};

export type UpdateUserInput = {
  darkTheme?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discordPrecache?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  excludedCollections?: InputMaybe<Array<Scalars['Float']['input']>>;
  insights?: InputMaybe<Scalars['String']['input']>;
  itemsPerPage?: InputMaybe<Scalars['Float']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  nameColor?: InputMaybe<Scalars['String']['input']>;
  privacyPolicyAccepted?: InputMaybe<Scalars['Boolean']['input']>;
  profileLayout?: InputMaybe<ProfileLayoutInput>;
  publicProfile?: InputMaybe<Scalars['Boolean']['input']>;
  storedStatus?: InputMaybe<Scalars['String']['input']>;
  themeEngine?: InputMaybe<ThemeEngineInput>;
  username?: InputMaybe<Scalars['String']['input']>;
  weatherUnit?: InputMaybe<Scalars['String']['input']>;
};

export type Upload = {
  __typename?: 'Upload';
  attachment: Scalars['String']['output'];
  autoCollectApproval?: Maybe<AutoCollectApproval>;
  collections: Array<Collection>;
  /** Non-deletable items are used for profile pictures, banners, etc and are not visible in the Gallery page. */
  deletable: Scalars['Boolean']['output'];
  fileSize: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  item?: Maybe<CollectionItem>;
  items: Array<CollectionItem>;
  name?: Maybe<Scalars['String']['output']>;
  originalFilename?: Maybe<Scalars['String']['output']>;
  starred?: Maybe<Star>;
  /** This is used for OCR scanned text from images. */
  textMetadata?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  /** @deprecated URL redirects were removed in TPUv2/NEXT. */
  urlRedirect?: Maybe<Scalars['String']['output']>;
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Float']['output'];
};

export type User = {
  __typename?: 'User';
  administrator: Scalars['Boolean']['output'];
  /** Ability to login with more then 1 password with different scopes. */
  alternatePasswords?: Maybe<Array<AlternatePassword>>;
  autoCollectRules: Array<AutoCollectRule>;
  avatar?: Maybe<Scalars['String']['output']>;
  badges: Array<Badge>;
  banned: Scalars['Boolean']['output'];
  /** UserV2 banner. */
  banner?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  darkTheme: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discordPrecache: Scalars['Boolean']['output'];
  domain?: Maybe<Domain>;
  domainId: Scalars['Float']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  /** Collections that are excluded from the Collections filter in Gallery. */
  excludedCollections?: Maybe<Array<Scalars['Float']['output']>>;
  experiments?: Maybe<Array<Experiment>>;
  /** @deprecated Fake paths are no longer available as of TPUv2/NEXT. */
  fakePath?: Maybe<Scalars['String']['output']>;
  friend: FriendStatus;
  friends: Array<Friend>;
  id: Scalars['Float']['output'];
  insights: UserInsights;
  integrations: Array<Integration>;
  /** @deprecated Invisible URLs are no longer available as of TPUv2/NEXT. */
  invisibleURLs: Scalars['Boolean']['output'];
  inviteId?: Maybe<Scalars['Float']['output']>;
  itemsPerPage: Scalars['Float']['output'];
  language: Scalars['String']['output'];
  moderator: Scalars['Boolean']['output'];
  /** The user's name color in Communications. */
  nameColor?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Array<FriendNickname>>;
  notifications: Array<Notification>;
  oauthAppId?: Maybe<Scalars['String']['output']>;
  /** How many AutoCollect approvals the user needs to approve/reject. */
  pendingAutoCollects?: Maybe<Scalars['Float']['output']>;
  plan?: Maybe<Plan>;
  privacyPolicyAccepted?: Maybe<Scalars['Boolean']['output']>;
  profileLayout: ProfileLayout;
  publicProfile: Scalars['Boolean']['output'];
  /** How much the user has uploaded in bytes. */
  quota: Scalars['Float']['output'];
  /** The user's scopes assigned to the API key used. In format like `user.view,user.modify` which belong to `Scope`. */
  scopes?: Maybe<Scalars['String']['output']>;
  sessions: Array<Session>;
  stats?: Maybe<Stats>;
  /** User status/presence shown to other users. */
  status: UserStatus;
  /** User status/presence that has `invisible` and is shown to the current user. */
  storedStatus: UserStoredStatus;
  /** @deprecated Subdomains are no longer available as of TPUv2/NEXT. */
  subdomainId?: Maybe<Scalars['Float']['output']>;
  subscription?: Maybe<TpuSubscription>;
  /** Subscriptions are no longer used as they were in TPUv1, and are now used to store metadata for permanent Gold subscriptions. */
  subscriptionId?: Maybe<Scalars['Float']['output']>;
  themeEngine?: Maybe<ThemeEngine>;
  /** @deprecated Replaced with `themeEngine`, used in legacy clients such as legacy.privateuploader.com. */
  themeId: Scalars['Float']['output'];
  totpEnable: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
  /** @deprecated Hidden upload usernames are no longer available as of TPUv2/NEXT. */
  uploadNameHidden: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
  weatherUnit: Scalars['String']['output'];
  /** How much the user has donated to PrivateUploader. (Likely unused in unofficial instances.) */
  xp: Scalars['Float']['output'];
};

export type UserCollectionsInput = {
  filter?: Array<CollectionFilter>;
  limit?: Scalars['Float']['input'];
  page?: Scalars['Float']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Insights privacy preference. */
export enum UserInsights {
  Everyone = 'EVERYONE',
  Friends = 'FRIENDS',
  Nobody = 'NOBODY'
}

export type UserProfileInput = {
  id?: InputMaybe<Scalars['Float']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

/** User status/presence shown to other users. */
export enum UserStatus {
  Busy = 'BUSY',
  Idle = 'IDLE',
  Offline = 'OFFLINE',
  Online = 'ONLINE',
  Unknown = 'UNKNOWN'
}

/** User status/presence that has `invisible` and is shown to the current user. */
export enum UserStoredStatus {
  Busy = 'BUSY',
  Idle = 'IDLE',
  Invisible = 'INVISIBLE',
  Online = 'ONLINE'
}

export type Weather = {
  __typename?: 'Weather';
  cached?: Maybe<Scalars['Boolean']['output']>;
  clouds?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['Boolean']['output']>;
  feels_like?: Maybe<Scalars['Float']['output']>;
  humidity?: Maybe<Scalars['Float']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  main?: Maybe<Scalars['String']['output']>;
  pressure?: Maybe<Scalars['Float']['output']>;
  temp?: Maybe<Scalars['Float']['output']>;
  temp_max?: Maybe<Scalars['Float']['output']>;
  temp_min?: Maybe<Scalars['Float']['output']>;
  visibility?: Maybe<Scalars['Float']['output']>;
  wind_deg?: Maybe<Scalars['Float']['output']>;
  wind_speed?: Maybe<Scalars['Float']['output']>;
};

export type Workspace = {
  __typename?: 'Workspace';
  createdAt: Scalars['Date']['output'];
  folders: Array<WorkspaceFolder>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
  users: Array<WorkspaceUser>;
};

export type WorkspaceFolder = {
  __typename?: 'WorkspaceFolder';
  children: Array<Note>;
  createdAt: Scalars['Date']['output'];
  folderId?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  workspace: Workspace;
  workspaceId: Scalars['Float']['output'];
};

/** The type of workspace item */
export enum WorkspaceItemType {
  Folder = 'FOLDER',
  Note = 'NOTE',
  Workspace = 'WORKSPACE'
}

export type WorkspaceNote = {
  __typename?: 'WorkspaceNote';
  blocks?: Maybe<Scalars['JSON']['output']>;
  time?: Maybe<Scalars['Float']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type WorkspaceNoteInput = {
  blocks?: InputMaybe<Scalars['JSON']['input']>;
  time?: InputMaybe<Scalars['Float']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type WorkspaceNoteMetadata = {
  __typename?: 'WorkspaceNoteMetadata';
  version?: Maybe<Scalars['String']['output']>;
};

export type WorkspaceUser = {
  __typename?: 'WorkspaceUser';
  accepted: Scalars['Boolean']['output'];
  configure: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Float']['output'];
  /** The unique identifier between the User and the Workspace. */
  identifier?: Maybe<Scalars['String']['output']>;
  read: Scalars['Boolean']['output'];
  recipientId: Scalars['Float']['output'];
  sender: PartialUserBase;
  senderId: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
  user: PartialUserBase;
  workspace: Workspace;
  workspaceId: Scalars['Float']['output'];
  write: Scalars['Boolean']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token: string, user: { __typename?: 'LoginUser', id: number, username: string, email: string } } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponse', token: string, user: { __typename?: 'LoginUser', id: number, username: string, email: string } } };

export type ChatsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ChatsQueryQuery = { __typename?: 'Query', chats: Array<{ __typename?: 'Chat', id: number, type: string, name: string, userId?: number | null, icon?: string | null, createdAt: any, updatedAt: any, legacyUserId?: number | null, _redisSortDate: string, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, association?: { __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, lastRead?: number | null, notifications: string, legacyUserId?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null } | null, users: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, lastRead?: number | null, notifications: string, legacyUserId?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }> };

export type MessagesQueryVariables = Exact<{
  input: InfiniteMessagesInput;
}>;


export type MessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', id: number, createdAt: any, updatedAt: any, chatId: number, userId?: number | null, content?: string | null, type?: MessageType | null, edited: boolean, editedAt?: any | null, replyId?: number | null, legacyUserId?: number | null, pinned: boolean, embeds: Array<{ __typename?: 'Embed', type: string, data?: { __typename?: 'EmbedData', url?: string | null, title?: string | null, description?: string | null, siteName?: string | null, width?: number | null, height?: number | null, type?: string | null, upload?: { __typename?: 'Upload', id: number } | null } | null }>, tpuUser?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, reply?: { __typename?: 'Message', id: number, createdAt: any, updatedAt: any, chatId: number, userId?: number | null, content?: string | null, type?: MessageType | null, edited: boolean, editedAt?: any | null, replyId?: number | null, legacyUserId?: number | null, pinned: boolean } | null, legacyUser?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, readReceipts: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, lastRead?: number | null, notifications: string, legacyUserId?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }> }> };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', id: number } };

export type CollectionQueryVariables = Exact<{
  input: CollectionInput;
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: number, name: string, image?: string | null, userId: number, shareLink?: string | null, shared?: boolean | null, itemCount?: number | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, preview?: { __typename?: 'CollectionItem', id: number, attachment: { __typename?: 'Upload', attachment: string, id: number } } | null, users: Array<{ __typename?: 'CollectionUser', id: number, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null, sender?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null } | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } } | null };

export type UserCollectionsQueryQueryVariables = Exact<{
  input: UserCollectionsInput;
}>;


export type UserCollectionsQueryQuery = { __typename?: 'Query', collections?: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', id: number, name: string, image?: string | null, userId: number, shareLink?: string | null, shared?: boolean | null, itemCount?: number | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, preview?: { __typename?: 'CollectionItem', attachment: { __typename?: 'Upload', attachment: string, id: number } } | null, users: Array<{ __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, administrator: boolean, moderator: boolean, avatar?: string | null } | null, sender?: { __typename?: 'PartialUserBase', username: string, id: number, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null } | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } }>, pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } } | null };

export type GetExperimentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExperimentsQuery = { __typename?: 'Query', experiments: Array<{ __typename?: 'ExperimentType', id: string, value: number, description?: string | null, createdAt?: any | null }> };

export type CoreStateQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CoreStateQueryQuery = { __typename?: 'Query', friends: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId: number, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, status: UserStatus } }>, experiments: Array<{ __typename?: 'ExperimentType', id: string, value: number, description?: string | null, createdAt?: any | null }>, workspaces: Array<{ __typename?: 'Workspace', id: number, name: string, userId: number, createdAt: any, updatedAt: any, icon?: string | null, folders: Array<{ __typename?: 'WorkspaceFolder', id: number, createdAt: any, updatedAt: any, name: string, workspaceId: number, folderId?: number | null, children: Array<{ __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null }> }> }>, chats: Array<{ __typename?: 'Chat', id: number, type: string, name: string, userId?: number | null, icon?: string | null, createdAt: any, updatedAt: any, legacyUserId?: number | null, _redisSortDate: string, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, association?: { __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, lastRead?: number | null, notifications: string, legacyUserId?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null } | null, users: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, lastRead?: number | null, notifications: string, legacyUserId?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, collections?: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', id: number, name: string, image?: string | null, userId: number, shareLink?: string | null, shared?: boolean | null, itemCount?: number | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, preview?: { __typename?: 'CollectionItem', attachment: { __typename?: 'Upload', attachment: string, id: number } } | null, users: Array<{ __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, administrator: boolean, moderator: boolean, avatar?: string | null } | null, sender?: { __typename?: 'PartialUserBase', username: string, id: number, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null } | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } }>, pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } } | null, coreState: { __typename?: 'CoreState', name: string, release: string, hostname: string, hostnameWithProtocol: string, registrations: boolean, officialInstance: boolean, termsNoteId?: string | null, privacyNoteId?: string | null, inviteAFriend: boolean, preTrustedDomains: Array<string>, hostnames: Array<string>, _redis: string, server: string, finishedSetup: boolean, domain: string, uptime: number, uptimeSys: number, commitVersion: string, announcements: Array<{ __typename?: 'Announcement', userId: number, content: string, type?: string | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } }>, stats: { __typename?: 'CoreStats', users: number, announcements: number, usage: number, collections: number, collectionItems: number, uploads: number, invites: number, inviteMilestone: number, pulse: number, pulses: number, docs: number, messages: number, chats: number, hours?: Array<string> | null, uploadGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> }, messageGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> }, pulseGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } }, maintenance: { __typename?: 'Maintenance', enabled: boolean, message?: string | null, statusPage?: string | null }, providers: { __typename?: 'Providers', anilist: boolean, lastfm: boolean, mal: boolean }, features: { __typename?: 'Features', communications: boolean, collections: boolean, autoCollects: boolean, workspaces: boolean, insights: boolean } }, currentUser?: { __typename?: 'User', username: string, email: string, description?: string | null, administrator: boolean, darkTheme: boolean, emailVerified: boolean, banned: boolean, inviteId?: number | null, discordPrecache: boolean, avatar?: string | null, domainId: number, totpEnable: boolean, quota: number, moderator: boolean, subscriptionId?: number | null, itemsPerPage: number, banner?: string | null, pendingAutoCollects?: number | null, status: UserStatus, storedStatus: UserStoredStatus, weatherUnit: string, xp: number, publicProfile: boolean, privacyPolicyAccepted?: boolean | null, excludedCollections?: Array<number> | null, id: number, language: string, nameColor?: string | null, insights: UserInsights, alternatePasswords?: Array<{ __typename?: 'AlternatePassword', scopes: string, totp: boolean, name: string }> | null, themeEngine?: { __typename?: 'ThemeEngine', fluidGradient: boolean, gradientOffset: string, version: number, deviceSync: boolean, showOnProfile: boolean, baseTheme: string, customCSS?: string | null, theme: { __typename?: 'ThemeEngineThemes', dark: { __typename?: 'ThemeEngineTheme', dark?: boolean | null, colors: { __typename?: 'ThemeEngineColors', primary: string, logo1: string, logo2: string, secondary: string, accent: string, error: string, info: string, success: string, warning: string, card: string, toolbar: string, sheet: string, text: string, dark: string, gold: string, background: string, background2: string } }, light: { __typename?: 'ThemeEngineTheme', dark?: boolean | null }, amoled: { __typename?: 'ThemeEngineTheme', dark?: boolean | null, colors: { __typename?: 'ThemeEngineColors', primary: string, logo1: string, logo2: string, secondary: string, accent: string, error: string, info: string, success: string, warning: string, card: string, toolbar: string, sheet: string, text: string, dark: string, gold: string, background: string, background2: string } } } } | null, plan?: { __typename?: 'Plan', quotaMax: number, color?: string | null, internalName: string, name: string, icon: string, id: number } | null, domain?: { __typename?: 'Domain', active: boolean, domain: string, id: number } | null, badges: Array<{ __typename?: 'Badge', color?: string | null, icon?: string | null, id: number, image?: string | null, name: string, priority?: number | null, tooltip?: string | null }>, subscription?: { __typename?: 'TPUSubscription', cancelled: boolean, metadata: { __typename?: 'SubscriptionMetadata', hours: number } } | null, notifications: Array<{ __typename?: 'Notification', id: number, dismissed: boolean, message: string, route?: string | null, createdAt: any }>, integrations: Array<{ __typename?: 'Integration', type: string, providerUsername?: string | null, providerUserId?: number | null, id: number, error?: string | null, expiresAt?: any | null }> } | null };

export type WeatherQueryVariables = Exact<{ [key: string]: never; }>;


export type WeatherQuery = { __typename?: 'Query', weather: { __typename?: 'Weather', temp?: number | null, feels_like?: number | null, temp_min?: number | null, temp_max?: number | null, pressure?: number | null, humidity?: number | null, wind_speed?: number | null, wind_deg?: number | null, clouds?: number | null, visibility?: number | null, error?: boolean | null, cached?: boolean | null, icon?: string | null, main?: string | null } };

export type GalleryQueryVariables = Exact<{
  input: GalleryInput;
}>;


export type GalleryQuery = { __typename?: 'Query', gallery: { __typename?: 'PaginatedUploadResponse', pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number }, items: Array<{ __typename?: 'Upload', id: number, attachment: string, userId: number, name?: string | null, originalFilename?: string | null, type: string, fileSize: number, deletable: boolean, textMetadata?: string | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null, collections: Array<{ __typename?: 'Collection', id: number, name: string }>, starred?: { __typename?: 'Star', id: number, userId: number, attachmentId: number } | null }> } };

export type UploadMutationVariables = Exact<{
  file: Scalars['File']['input'];
}>;


export type UploadMutation = { __typename?: 'Mutation', upload: { __typename?: 'Upload', id: number, attachment: string } };

export type FriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type FriendsQuery = { __typename?: 'Query', friends: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId: number, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, status: UserStatus } }> };

export type UserQueryVariables = Exact<{
  input: UserProfileInput;
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'PartialUserPublic', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, banned: boolean, banner?: string | null, description?: string | null, friend?: FriendStatus | null, insights: UserInsights, publicProfile: boolean, quota: number, xp?: number | null, badges: Array<{ __typename?: 'Badge', id: number, name: string, description?: string | null, tooltip?: string | null, image?: string | null, icon?: string | null, color?: string | null, unlocked: boolean, priority?: number | null }>, friends?: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId: number, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, otherUser: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } }> | null, plan: { __typename?: 'Plan', id: number, name: string, quotaMax: number, price: number, features?: string | null, color?: string | null, internalName: string, purchasable: boolean, internalFeatures?: string | null, icon: string }, platforms?: Array<{ __typename?: 'Platform', platform: string, id: string, lastSeen: string, status: string }> | null, profileLayout?: { __typename?: 'ProfileLayout', version: number, layout: { __typename?: 'ProfileLayoutObject', columns: Array<{ __typename?: 'ProfileLayoutColumn', rows: Array<{ __typename?: 'ProfileLayoutComponent', name: string, id: string, props?: { __typename?: 'ProfileLayoutProps', height?: number | null, friendsOnly?: boolean | null, display?: number | null, type?: string | null, links?: Array<{ __typename?: 'ProfileLayoutPropLink', name: string, url: string, color: string }> | null, children?: Array<{ __typename?: 'ProfileLayoutComponent', name: string, id: string, props?: { __typename?: 'ProfileLayoutProps', height?: number | null, friendsOnly?: boolean | null, display?: number | null, type?: string | null, links?: Array<{ __typename?: 'ProfileLayoutPropLink', name: string, url: string, color: string }> | null } | null }> | null } | null }> }> }, config: { __typename?: 'ProfileLayoutConfig', containerMargin?: number | null, showStatsSidebar: boolean } } | null, stats?: { __typename?: 'Stats', usage: number, collections: number, collectionItems: number, uploads: number, pulse: number, pulses: number, docs: number, uploadGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> }, messageGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> }, pulseGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } } | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: boolean };

export type GetUserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQueryQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', username: string, email: string, description?: string | null, administrator: boolean, darkTheme: boolean, emailVerified: boolean, banned: boolean, inviteId?: number | null, discordPrecache: boolean, avatar?: string | null, domainId: number, totpEnable: boolean, quota: number, moderator: boolean, subscriptionId?: number | null, itemsPerPage: number, banner?: string | null, status: UserStatus, storedStatus: UserStoredStatus, weatherUnit: string, xp: number, publicProfile: boolean, privacyPolicyAccepted?: boolean | null, excludedCollections?: Array<number> | null, id: number, language: string, nameColor?: string | null, insights: UserInsights, alternatePasswords?: Array<{ __typename?: 'AlternatePassword', scopes: string, totp: boolean, name: string }> | null, themeEngine?: { __typename?: 'ThemeEngine', fluidGradient: boolean, gradientOffset: string, version: number, deviceSync: boolean, showOnProfile: boolean, baseTheme: string, customCSS?: string | null, theme: { __typename?: 'ThemeEngineThemes', dark: { __typename?: 'ThemeEngineTheme', dark?: boolean | null, colors: { __typename?: 'ThemeEngineColors', primary: string, logo1: string, logo2: string, secondary: string, accent: string, error: string, info: string, success: string, warning: string, card: string, toolbar: string, sheet: string, text: string, dark: string, gold: string, background: string, background2: string } }, light: { __typename?: 'ThemeEngineTheme', dark?: boolean | null }, amoled: { __typename?: 'ThemeEngineTheme', dark?: boolean | null, colors: { __typename?: 'ThemeEngineColors', primary: string, logo1: string, logo2: string, secondary: string, accent: string, error: string, info: string, success: string, warning: string, card: string, toolbar: string, sheet: string, text: string, dark: string, gold: string, background: string, background2: string } } } } | null, plan?: { __typename?: 'Plan', quotaMax: number, color?: string | null, internalName: string, name: string, icon: string, id: number } | null, domain?: { __typename?: 'Domain', active: boolean, domain: string, id: number } | null, badges: Array<{ __typename?: 'Badge', color?: string | null, icon?: string | null, id: number, image?: string | null, name: string, priority?: number | null, tooltip?: string | null }>, subscription?: { __typename?: 'TPUSubscription', cancelled: boolean, metadata: { __typename?: 'SubscriptionMetadata', hours: number } } | null, notifications: Array<{ __typename?: 'Notification', id: number, dismissed: boolean, message: string, route?: string | null }>, integrations: Array<{ __typename?: 'Integration', type: string, providerUsername?: string | null, providerUserId?: number | null, id: number, error?: string | null, expiresAt?: any | null }> } | null };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null, versions: Array<{ __typename?: 'NoteVersion', id: string, noteId: number, userId: number }>, permissions?: { __typename?: 'NotePermissionsMetadata', modify: boolean, read: boolean, configure: boolean } | null } };

export type CreateWorkspaceMutationVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type CreateWorkspaceMutation = { __typename?: 'Mutation', createWorkspace: { __typename?: 'Workspace', id: number, name: string, userId: number, createdAt: any, updatedAt: any, icon?: string | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, folders: Array<{ __typename?: 'WorkspaceFolder', id: number, createdAt: any, updatedAt: any, name: string, workspaceId: number, folderId?: number | null, children: Array<{ __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null, metadata?: { __typename?: 'WorkspaceNoteMetadata', version?: string | null } | null, versions: Array<{ __typename?: 'NoteVersion', id: string, noteId: number, userId: number }>, permissions?: { __typename?: 'NotePermissionsMetadata', modify: boolean, read: boolean, configure: boolean } | null }>, workspace: { __typename?: 'Workspace', id: number, name: string, userId: number, createdAt: any, updatedAt: any, icon?: string | null } }>, users: Array<{ __typename?: 'WorkspaceUser', id: number, createdAt: any, updatedAt: any, workspaceId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId: number, senderId: number, identifier?: string | null, sender: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } }> } };

export type NoteQueryVariables = Exact<{
  input: NoteInput;
}>;


export type NoteQuery = { __typename?: 'Query', note?: { __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null, permissions?: { __typename?: 'NotePermissionsMetadata', modify: boolean, read: boolean, configure: boolean } | null, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null, versions: Array<{ __typename?: 'NoteVersion', id: string, noteId: number, userId: number }> } | null };

export type SaveNoteMutationVariables = Exact<{
  input: SaveNoteInput;
}>;


export type SaveNoteMutation = { __typename?: 'Mutation', saveNote: { __typename?: 'Note', id: number, name: string, workspaceFolderId: number } };

export type ToggleNoteShareMutationVariables = Exact<{
  input: Scalars['Int']['input'];
}>;


export type ToggleNoteShareMutation = { __typename?: 'Mutation', toggleNoteShare: { __typename?: 'Note', shareLink?: string | null } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const ChatsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_redisSortDate"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<ChatsQueryQuery, ChatsQueryQueryVariables>;
export const MessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Messages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InfiniteMessagesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"tpuUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MessagesQuery, MessagesQueryVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const CollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Collection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionQuery, CollectionQueryVariables>;
export const UserCollectionsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserCollectionsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCollectionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]}}]}}]} as unknown as DocumentNode<UserCollectionsQueryQuery, UserCollectionsQueryQueryVariables>;
export const GetExperimentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExperiments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetExperimentsQuery, GetExperimentsQueryVariables>;
export const CoreStateQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CoreStateQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"experiments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_redisSortDate"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ALL"}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"coreState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"release"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"hostnameWithProtocol"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"}},{"kind":"Field","name":{"kind":"Name","value":"usage"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"collectionItems"}},{"kind":"Field","name":{"kind":"Name","value":"uploadGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pulseGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploads"}},{"kind":"Field","name":{"kind":"Name","value":"invites"}},{"kind":"Field","name":{"kind":"Name","value":"inviteMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"pulses"}},{"kind":"Field","name":{"kind":"Name","value":"docs"}},{"kind":"Field","name":{"kind":"Name","value":"messages"}},{"kind":"Field","name":{"kind":"Name","value":"chats"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maintenance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrations"}},{"kind":"Field","name":{"kind":"Name","value":"officialInstance"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anilist"}},{"kind":"Field","name":{"kind":"Name","value":"lastfm"}},{"kind":"Field","name":{"kind":"Name","value":"mal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"termsNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"privacyNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"}},{"kind":"Field","name":{"kind":"Name","value":"insights"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inviteAFriend"}},{"kind":"Field","name":{"kind":"Name","value":"preTrustedDomains"}},{"kind":"Field","name":{"kind":"Name","value":"hostnames"}},{"kind":"Field","name":{"kind":"Name","value":"_redis"}},{"kind":"Field","name":{"kind":"Name","value":"server"}},{"kind":"Field","name":{"kind":"Name","value":"finishedSetup"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"uptime"}},{"kind":"Field","name":{"kind":"Name","value":"uptimeSys"}},{"kind":"Field","name":{"kind":"Name","value":"commitVersion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"darkTheme"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"inviteId"}},{"kind":"Field","name":{"kind":"Name","value":"discordPrecache"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"domainId"}},{"kind":"Field","name":{"kind":"Name","value":"totpEnable"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"pendingAutoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePasswords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"weatherUnit"}},{"kind":"Field","name":{"kind":"Name","value":"themeEngine"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"logo1"}},{"kind":"Field","name":{"kind":"Name","value":"logo2"}},{"kind":"Field","name":{"kind":"Name","value":"secondary"}},{"kind":"Field","name":{"kind":"Name","value":"accent"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"warning"}},{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"toolbar"}},{"kind":"Field","name":{"kind":"Name","value":"sheet"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"background2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dark"}}]}},{"kind":"Field","name":{"kind":"Name","value":"light"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amoled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"colors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"logo1"}},{"kind":"Field","name":{"kind":"Name","value":"logo2"}},{"kind":"Field","name":{"kind":"Name","value":"secondary"}},{"kind":"Field","name":{"kind":"Name","value":"accent"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"warning"}},{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"toolbar"}},{"kind":"Field","name":{"kind":"Name","value":"sheet"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"background2"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fluidGradient"}},{"kind":"Field","name":{"kind":"Name","value":"gradientOffset"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"deviceSync"}},{"kind":"Field","name":{"kind":"Name","value":"showOnProfile"}},{"kind":"Field","name":{"kind":"Name","value":"baseTheme"}},{"kind":"Field","name":{"kind":"Name","value":"customCSS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"excludedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dismissed"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerUsername"}},{"kind":"Field","name":{"kind":"Name","value":"providerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]}}]} as unknown as DocumentNode<CoreStateQueryQuery, CoreStateQueryQueryVariables>;
export const WeatherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"temp"}},{"kind":"Field","name":{"kind":"Name","value":"feels_like"}},{"kind":"Field","name":{"kind":"Name","value":"temp_min"}},{"kind":"Field","name":{"kind":"Name","value":"temp_max"}},{"kind":"Field","name":{"kind":"Name","value":"pressure"}},{"kind":"Field","name":{"kind":"Name","value":"humidity"}},{"kind":"Field","name":{"kind":"Name","value":"wind_speed"}},{"kind":"Field","name":{"kind":"Name","value":"wind_deg"}},{"kind":"Field","name":{"kind":"Name","value":"clouds"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"cached"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"main"}}]}}]}}]} as unknown as DocumentNode<WeatherQuery, WeatherQueryVariables>;
export const GalleryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Gallery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GalleryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gallery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"originalFilename"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"deletable"}},{"kind":"Field","name":{"kind":"Name","value":"textMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"starred"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GalleryQuery, GalleryQueryVariables>;
export const UploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Upload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"File"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}}]}}]}}]} as unknown as DocumentNode<UploadMutation, UploadMutationVariables>;
export const FriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<FriendsQuery, FriendsQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"unlocked"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"friend"}},{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"otherUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"features"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"purchasable"}},{"kind":"Field","name":{"kind":"Name","value":"internalFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"platforms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeen"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileLayout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"friendsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"friendsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"containerMargin"}},{"kind":"Field","name":{"kind":"Name","value":"showStatsSidebar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usage"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"collectionItems"}},{"kind":"Field","name":{"kind":"Name","value":"uploadGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pulseGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploads"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"pulses"}},{"kind":"Field","name":{"kind":"Name","value":"docs"}}]}},{"kind":"Field","name":{"kind":"Name","value":"xp"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"darkTheme"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"inviteId"}},{"kind":"Field","name":{"kind":"Name","value":"discordPrecache"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"domainId"}},{"kind":"Field","name":{"kind":"Name","value":"totpEnable"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePasswords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"weatherUnit"}},{"kind":"Field","name":{"kind":"Name","value":"themeEngine"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"logo1"}},{"kind":"Field","name":{"kind":"Name","value":"logo2"}},{"kind":"Field","name":{"kind":"Name","value":"secondary"}},{"kind":"Field","name":{"kind":"Name","value":"accent"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"warning"}},{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"toolbar"}},{"kind":"Field","name":{"kind":"Name","value":"sheet"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"background2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dark"}}]}},{"kind":"Field","name":{"kind":"Name","value":"light"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amoled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"colors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"logo1"}},{"kind":"Field","name":{"kind":"Name","value":"logo2"}},{"kind":"Field","name":{"kind":"Name","value":"secondary"}},{"kind":"Field","name":{"kind":"Name","value":"accent"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"warning"}},{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"toolbar"}},{"kind":"Field","name":{"kind":"Name","value":"sheet"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"background2"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fluidGradient"}},{"kind":"Field","name":{"kind":"Name","value":"gradientOffset"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"deviceSync"}},{"kind":"Field","name":{"kind":"Name","value":"showOnProfile"}},{"kind":"Field","name":{"kind":"Name","value":"baseTheme"}},{"kind":"Field","name":{"kind":"Name","value":"customCSS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"excludedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dismissed"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"route"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerUsername"}},{"kind":"Field","name":{"kind":"Name","value":"providerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQueryQuery, GetUserQueryQueryVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const CreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const NoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Note"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<NoteQuery, NoteQueryVariables>;
export const SaveNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}}]}}]}}]} as unknown as DocumentNode<SaveNoteMutation, SaveNoteMutationVariables>;
export const ToggleNoteShareDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleNoteShare"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleNoteShare"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shareLink"}}]}}]}}]} as unknown as DocumentNode<ToggleNoteShareMutation, ToggleNoteShareMutationVariables>;