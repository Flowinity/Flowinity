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

export type ActOnAutoCollectsInput = {
  action: AutoCollectAction;
  items: Array<Scalars['Int']['input']>;
};

export type AddAppUserInput = {
  manage?: InputMaybe<Scalars['Boolean']['input']>;
  oauthAppId: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type AddBotToChatInput = {
  associationId: Scalars['Int']['input'];
  botAppId: Scalars['String']['input'];
  permissions: Array<Scalars['String']['input']>;
};

export type AddChatUser = {
  action: ToggleUser;
  chatAssociationId: Scalars['Int']['input'];
  users: Array<Scalars['Float']['input']>;
};

export type AddRank = {
  chatAssociationId: Scalars['Int']['input'];
  rankId: Scalars['String']['input'];
  updatingChatAssociationId: Scalars['Int']['input'];
};

export type AddToCollectionInput = {
  collectionId: Scalars['Float']['input'];
  items: Array<Scalars['Float']['input']>;
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
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

/** Used for chat audit log to determine what type of action was performed. */
export enum AuditLogActionType {
  Add = 'ADD',
  Modify = 'MODIFY',
  Remove = 'REMOVE'
}

/** Used for chat audit log. */
export enum AuditLogCategory {
  Bot = 'BOT',
  Emoji = 'EMOJI',
  Invite = 'INVITE',
  Message = 'MESSAGE',
  PinMessage = 'PIN_MESSAGE',
  Rank = 'RANK',
  Settings = 'SETTINGS',
  User = 'USER'
}

export type AuditLogInput = {
  associationId: Scalars['Int']['input'];
  limit?: Scalars['Float']['input'];
  page?: Scalars['Float']['input'];
};

export type AuthorizeAppInput = {
  id: Scalars['String']['input'];
  /** Used for bots. */
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  scopes: Scalars['String']['input'];
};

export type AuthorizeAppResponse = {
  __typename?: 'AuthorizeAppResponse';
  token?: Maybe<Scalars['String']['output']>;
};

export enum AutoCollectAction {
  Approve = 'APPROVE',
  Reject = 'REJECT'
}

export type AutoCollectApproval = {
  __typename?: 'AutoCollectApproval';
  approved: Scalars['Boolean']['output'];
  attachment?: Maybe<Upload>;
  autoCollectRule?: Maybe<AutoCollectRule>;
  autoCollectRuleId: Scalars['Float']['output'];
  collection?: Maybe<Collection>;
  collectionId: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
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
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  requireApproval: Scalars['Boolean']['output'];
  rules: Array<AutoCollectParentRule>;
};

export type AutoCollectRuleQueryInput = {
  id: Scalars['Int']['input'];
};

export type Badge = {
  __typename?: 'Badge';
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  plan: Plan;
  priority?: Maybe<Scalars['Float']['output']>;
  tooltip?: Maybe<Scalars['String']['output']>;
  unlocked: Scalars['Boolean']['output'];
  users: Array<PartialUserBase>;
};

export type BlockUserInput = {
  silent: Scalars['Boolean']['input'];
  userId: Scalars['Int']['input'];
};

export type BlockedUser = {
  __typename?: 'BlockedUser';
  blockedUser?: Maybe<PartialUserBase>;
  blockedUserId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  /** To the blocked user it appears as though they're unblocked, however the blocker will not receive any messages from them, and their messages will be hidden inside of group chats. */
  silent: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

export type ChangeEmailInput = {
  email: Scalars['String']['input'];
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  totp?: InputMaybe<Scalars['String']['input']>;
};

export type ChangeUsernameInput = {
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type Chat = {
  __typename?: 'Chat';
  _redisSortDate?: Maybe<Scalars['String']['output']>;
  association?: Maybe<ChatAssociation>;
  background?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  emoji?: Maybe<Array<ChatEmoji>>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Array is empty if you don't have the `OVERVIEW` permission in the chat. */
  invites: Array<ChatInvite>;
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
  messages: Array<Message>;
  name: Scalars['String']['output'];
  ranks: Array<ChatRank>;
  recipient?: Maybe<PartialUserBase>;
  type: Scalars['String']['output'];
  unread?: Maybe<Scalars['Int']['output']>;
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
  createdAt: Scalars['Date']['output'];
  /** Only true/false for current user, null for other ChatAssociations. This determines whether the chat is visible in the sidebar (open or closed). */
  hidden?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  invite?: Maybe<ChatInvite>;
  inviteUsed?: Maybe<Scalars['String']['output']>;
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
  permissions: Array<Scalars['String']['output']>;
  /** @deprecated `ChatRank` has replaced legacy rank for granular permission control. */
  rank: Scalars['String']['output'];
  ranks: Array<ChatRank>;
  ranksMap: Array<Scalars['String']['output']>;
  /** Used for user virtual which falls back to a Colubrina account. */
  tpuUser?: Maybe<PartialUserBase>;
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Float']['output']>;
};

export type ChatAuditLog = {
  __typename?: 'ChatAuditLog';
  actionType: AuditLogActionType;
  category: AuditLogCategory;
  chatId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  userId: Scalars['Int']['output'];
};

export type ChatEmoji = {
  __typename?: 'ChatEmoji';
  chatId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  deleted: Scalars['Boolean']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  userId: Scalars['Int']['output'];
};

export type ChatInput = {
  associationId?: InputMaybe<Scalars['Int']['input']>;
  chatId?: InputMaybe<Scalars['Int']['input']>;
};

export type ChatInvite = {
  __typename?: 'ChatInvite';
  chat: Chat;
  chatId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  expiredAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['String']['output'];
  invalidated: Scalars['Boolean']['output'];
  rank?: Maybe<ChatRank>;
  /** Automatically assigns rank to user when joining. If unset the backend will set the `managed` Members role. */
  rankId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  user: PartialUserBase;
  userId: Scalars['Int']['output'];
};

export type ChatPermission = {
  __typename?: 'ChatPermission';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  group: RankPermissionGroup;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ChatRank = {
  __typename?: 'ChatRank';
  associations: Array<ChatAssociation>;
  chatId: Scalars['Int']['output'];
  color?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  managed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  permissions: Array<ChatPermission>;
  permissionsMap: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userId: Scalars['Int']['output'];
};

export type ChatsInput = {
  hidden?: Scalars['Boolean']['input'];
};

export type Collection = {
  __typename?: 'Collection';
  attachments: Array<Upload>;
  autoCollectApprovals: Array<AutoCollectApproval>;
  avatar?: Maybe<Scalars['String']['output']>;
  /** The recommended way to obtain the banner for a collection, it uses field `image`, and if null, falls back to the last added image preview. */
  banner?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  /** Please use field `banner` instead if you want to obtain the banner for a collection. */
  image?: Maybe<Scalars['String']['output']>;
  itemCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  permissionsMetadata: PermissionsMetadata;
  preview?: Maybe<CollectionItem>;
  recipient?: Maybe<CollectionUser>;
  shareLink?: Maybe<Scalars['String']['output']>;
  shared?: Maybe<Scalars['Boolean']['output']>;
  updatedAt: Scalars['Date']['output'];
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
  id?: InputMaybe<Scalars['Int']['input']>;
  shareLink?: InputMaybe<Scalars['String']['input']>;
};

export type CollectionItem = {
  __typename?: 'CollectionItem';
  attachment: Upload;
  attachmentId: Scalars['Float']['output'];
  collection: Collection;
  collectionId: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  /** Used to prevent duplicates by forming `uploadId-collectionId`. Can be null for items created before October 2022. */
  identifier?: Maybe<Scalars['String']['output']>;
  pinned: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
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
  id: Scalars['Int']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  read: Scalars['Boolean']['output'];
  recipientId?: Maybe<Scalars['Float']['output']>;
  sender?: Maybe<PartialUserBase>;
  senderId?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  write: Scalars['Boolean']['output'];
};

export type Connection = {
  __typename?: 'Connection';
  ip: Scalars['String']['output'];
  /** @deprecated No longer used in v4. */
  whitelist: Scalars['Boolean']['output'];
};

export type CoreState = {
  __typename?: 'CoreState';
  _redis: Scalars['String']['output'];
  announcements: Array<Announcement>;
  commitVersion: Scalars['String']['output'];
  connection: Connection;
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
  hours?: Maybe<Scalars['JSON']['output']>;
  inviteMilestone: Scalars['Float']['output'];
  invites: Scalars['Float']['output'];
  messageGraph?: Maybe<DataLabelsGraph>;
  messages: Scalars['Float']['output'];
  pulse: Scalars['Float']['output'];
  pulseGraph?: Maybe<DataLabelsGraph>;
  pulses: Scalars['Float']['output'];
  uploadGraph?: Maybe<DataLabelsGraph>;
  uploads: Scalars['Float']['output'];
  usage?: Maybe<Scalars['Float']['output']>;
  users: Scalars['Float']['output'];
};

export type CreateAppInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  private: Scalars['Boolean']['input'];
  redirectUri?: InputMaybe<Scalars['String']['input']>;
  verified: Scalars['Boolean']['input'];
};

export type CreateBotInput = {
  id: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CreateChatInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  users: Array<Scalars['Float']['input']>;
};

export type CreateCollectionInput = {
  name: Scalars['String']['input'];
};

export type CreateInviteInput = {
  associationId: Scalars['Int']['input'];
  /** In hours. */
  expiry?: InputMaybe<Scalars['Int']['input']>;
  /** Auto assign rank on join. */
  rankId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNoteInput = {
  name: Scalars['String']['input'];
  workspaceFolderId: Scalars['Float']['input'];
};

export type CreateRank = {
  associationId: Scalars['Int']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWorkspaceFolderInput = {
  name: Scalars['String']['input'];
  workspaceId: Scalars['Float']['input'];
};

/** Used for deleting chats and transferring ownership. */
export type DangerZoneChatInput = {
  associationId: Scalars['Int']['input'];
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
};

export type DataLabelsGraph = {
  __typename?: 'DataLabelsGraph';
  data: Array<Scalars['Float']['output']>;
  labels: Array<Scalars['String']['output']>;
};

export type DeleteEmojiInput = {
  associationId: Scalars['Int']['input'];
  id: Scalars['String']['input'];
};

export type DeleteRank = {
  associationId: Scalars['Int']['input'];
  rankId: Scalars['String']['input'];
};

export type DeleteUploadInput = {
  items: Array<Scalars['Float']['input']>;
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
  id: Scalars['Int']['output'];
  /** @deprecated Granular user control was removed in TPUv2. */
  restricted: Scalars['String']['output'];
  /** @deprecated Subdomains were removed in TPUv2. */
  subdomains: Scalars['Boolean']['output'];
  /** @deprecated Subdomains were removed in TPUv2. */
  subdomainsCreate: Scalars['Boolean']['output'];
  user: PartialUserBase;
  userId: Scalars['Int']['output'];
  /** Only populated in some admin contexts */
  users?: Maybe<Array<PartialUserBase>>;
  /** @deprecated Cloudflare integration was removed in TPUv2. */
  zone?: Maybe<Scalars['String']['output']>;
};

export type Embed = {
  __typename?: 'Embed';
  data?: Maybe<Scalars['JSON']['output']>;
  type: Scalars['String']['output'];
};

export type EmbedInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  graph?: InputMaybe<InteractiveGraphInput>;
  image?: InputMaybe<Scalars['String']['input']>;
  siteName?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
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
  value: Scalars['Int']['output'];
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
  friendId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  otherUser: PartialUserFriend;
  status: FriendStatus;
  updatedAt: Scalars['Date']['output'];
  user: PartialUserFriend;
  userId: Scalars['Int']['output'];
};

export type FriendNickname = {
  __typename?: 'FriendNickname';
  createdAt: Scalars['Date']['output'];
  friend: PartialUserBase;
  friendId: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  nickname: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
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

export type FriendsInput = {
  status?: InputMaybe<FriendStatus>;
};

/** The filter to apply to the gallery request */
export enum GalleryFilter {
  All = 'ALL',
  Audio = 'AUDIO',
  Gifs = 'GIFS',
  Images = 'IMAGES',
  IncludeMetadata = 'INCLUDE_METADATA',
  IncludeUndeletable = 'INCLUDE_UNDELETABLE',
  NoCollection = 'NO_COLLECTION',
  OnlyUndeletable = 'ONLY_UNDELETABLE',
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
  collectionId?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<Array<GalleryFilter>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GalleryOrder>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  /** Requires Type to be COLLECTION */
  shareLink?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<GallerySort>;
  type?: InputMaybe<GalleryType>;
};

/** The order to apply to the gallery request */
export enum GalleryOrder {
  Asc = 'ASC',
  Desc = 'DESC',
  Random = 'RANDOM'
}

/** The advanced search mode. */
export enum GallerySearchMode {
  After = 'AFTER',
  Before = 'BEFORE',
  Collection = 'COLLECTION',
  During = 'DURING',
  Meta = 'META',
  Name = 'NAME',
  Order = 'ORDER',
  Size = 'SIZE',
  Type = 'TYPE',
  User = 'USER'
}

/** The sort to apply to the gallery request */
export enum GallerySort {
  AddedAt = 'ADDED_AT',
  CreatedAt = 'CREATED_AT',
  Name = 'NAME',
  Size = 'SIZE',
  UpdatedAt = 'UPDATED_AT'
}

/** The type of gallery request, for example if it's the personal gallery page, or a Collection */
export enum GalleryType {
  AutoCollect = 'AUTO_COLLECT',
  Collection = 'COLLECTION',
  Personal = 'PERSONAL',
  Starred = 'STARRED'
}

export type GenericSuccessObject = {
  __typename?: 'GenericSuccessObject';
  success: Scalars['Boolean']['output'];
};

export type GetMailInput = {
  mailbox: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Float']['input']>;
  userId: Scalars['Float']['input'];
};

export type InfiniteMessagesInput = {
  associationId: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  position?: InputMaybe<ScrollPosition>;
  search?: InputMaybe<MessagesSearch>;
};

export type Integration = {
  __typename?: 'Integration';
  createdAt: Scalars['Date']['output'];
  error?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['Int']['output'];
  providerUserCache?: Maybe<Scalars['JSON']['output']>;
  providerUserId?: Maybe<Scalars['Float']['output']>;
  providerUsername?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type InteractiveGraphInput = {
  type: Scalars['String']['input'];
};

export type InvalidateInviteInput = {
  associationId: Scalars['Int']['input'];
  inviteId: Scalars['String']['input'];
};

export type InviteInput = {
  inviteId: Scalars['String']['input'];
};

export type JoinChatFromInviteInput = {
  inviteId: Scalars['String']['input'];
};

export type LeaveChatInput = {
  associationId: Scalars['Int']['input'];
};

export type ListResponse = {
  __typename?: 'ListResponse';
  delimiter: Scalars['String']['output'];
  flags: Array<Scalars['String']['output']>;
  listed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  specialUse?: Maybe<Scalars['String']['output']>;
  subscribed?: Maybe<Scalars['Boolean']['output']>;
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

export type LookupPrefix = {
  __typename?: 'LookupPrefix';
  botId: Scalars['Float']['output'];
  command: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type LookupPrefixInput = {
  chatAssociationId: Scalars['Int']['input'];
  prefix: Scalars['String']['input'];
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
  chatId: Scalars['Int']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  edited: Scalars['Boolean']['output'];
  editedAt?: Maybe<Scalars['Date']['output']>;
  embeds: Array<Embed>;
  emoji?: Maybe<Array<ChatEmoji>>;
  error: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  legacyUser?: Maybe<PartialUserBase>;
  legacyUserId?: Maybe<Scalars['Int']['output']>;
  pending: Scalars['Boolean']['output'];
  pinned: Scalars['Boolean']['output'];
  readReceipts: Array<ChatAssociation>;
  reply?: Maybe<Message>;
  replyId?: Maybe<Scalars['Int']['output']>;
  tpuUser?: Maybe<PartialUserBase>;
  type?: Maybe<MessageType>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
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
  pins?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  actOnAutoCollects: GenericSuccessObject;
  addBotToChat: ChatAssociation;
  addChatRank: ChatRank;
  addChatUsers: GenericSuccessObject;
  addCollectionUser: CollectionUser;
  addOauthUser: OauthUser;
  addToCollection: Array<CollectionItem>;
  adminMigrateLegacyRanksForChat: GenericSuccessObject;
  adminSendEmailForUnverifiedUsers: GenericSuccessObject;
  applyDomain: Domain;
  blockUser: GenericSuccessObject;
  changeUserEmail: Scalars['Boolean']['output'];
  changeUserPassword: Scalars['Boolean']['output'];
  changeUsername: Scalars['Boolean']['output'];
  createBotOauthApp: PartialUserBase;
  createChat: Chat;
  createChatInvite: ChatInvite;
  createCollection: Collection;
  createNote: Note;
  createOauthApp: OauthApp;
  /** Create workspace */
  createWorkspace: Workspace;
  /** Create a new Workspace Folder. */
  createWorkspaceFolder: WorkspaceFolder;
  deleteChatRank: GenericSuccessObject;
  deleteEmoji: GenericSuccessObject;
  deleteGroup: GenericSuccessObject;
  deleteOauthApp: GenericSuccessObject;
  deleteUploads: GenericSuccessObject;
  /** Delete a Note. */
  deleteWorkspaceItem: Scalars['Boolean']['output'];
  invalidateChatInvite: GenericSuccessObject;
  joinChatFromInvite: ChatAssociation;
  leaveChat: GenericSuccessObject;
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  oauthAppAuthorize: AuthorizeAppResponse;
  oauthAppDeauthorize: GenericSuccessObject;
  register: LoginResponse;
  registerBotCommands: GenericSuccessObject;
  registerBotPrefix: GenericSuccessObject;
  removeCollectionUser: GenericSuccessObject;
  removeFromCollection: Scalars['Int']['output'];
  resetOauthSecret: GenericSuccessObject;
  saveNote: Note;
  sendMessage: Message;
  setExperiment: Experiment;
  starUpload: StarUploadResponse;
  /** Toggle the ShareLink for a Note. */
  toggleNoteShare: Note;
  toggleUserRank: GenericSuccessObject;
  transferGroupOwnership: Chat;
  updateChat: Chat;
  updateChatRank: ChatRank;
  updateChatRankOrder: Array<ChatRank>;
  updateCollection: Collection;
  updateCollectionUserPermissions: CollectionUser;
  updateEmoji: ChatEmoji;
  updateOauthApp: GenericSuccessObject;
  updateOauthUser: OauthUser;
  updateStatus: UserStoredStatus;
  updateUpload: Upload;
  updateUser: Scalars['Boolean']['output'];
};


export type MutationActOnAutoCollectsArgs = {
  input: ActOnAutoCollectsInput;
};


export type MutationAddBotToChatArgs = {
  input: AddBotToChatInput;
};


export type MutationAddChatRankArgs = {
  input: CreateRank;
};


export type MutationAddChatUsersArgs = {
  input: AddChatUser;
};


export type MutationAddCollectionUserArgs = {
  input: UpdateCollectionUserPermissionsInput;
};


export type MutationAddOauthUserArgs = {
  input: AddAppUserInput;
};


export type MutationAddToCollectionArgs = {
  input: AddToCollectionInput;
};


export type MutationApplyDomainArgs = {
  domainId: Scalars['Int']['input'];
};


export type MutationBlockUserArgs = {
  input: BlockUserInput;
};


export type MutationChangeUserEmailArgs = {
  input: ChangeEmailInput;
};


export type MutationChangeUserPasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationChangeUsernameArgs = {
  input: ChangeUsernameInput;
};


export type MutationCreateBotOauthAppArgs = {
  input: CreateBotInput;
};


export type MutationCreateChatArgs = {
  input: CreateChatInput;
};


export type MutationCreateChatInviteArgs = {
  input: CreateInviteInput;
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationCreateOauthAppArgs = {
  input: CreateAppInput;
};


export type MutationCreateWorkspaceArgs = {
  input: Scalars['String']['input'];
};


export type MutationCreateWorkspaceFolderArgs = {
  input: CreateWorkspaceFolderInput;
};


export type MutationDeleteChatRankArgs = {
  input: DeleteRank;
};


export type MutationDeleteEmojiArgs = {
  input: DeleteEmojiInput;
};


export type MutationDeleteGroupArgs = {
  input: DangerZoneChatInput;
};


export type MutationDeleteOauthAppArgs = {
  input: MyAppInput;
};


export type MutationDeleteUploadsArgs = {
  input: DeleteUploadInput;
};


export type MutationDeleteWorkspaceItemArgs = {
  input: DeleteWorkspaceItemInput;
};


export type MutationInvalidateChatInviteArgs = {
  input: InvalidateInviteInput;
};


export type MutationJoinChatFromInviteArgs = {
  input: JoinChatFromInviteInput;
};


export type MutationLeaveChatArgs = {
  input: LeaveChatInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationOauthAppAuthorizeArgs = {
  input: AuthorizeAppInput;
};


export type MutationOauthAppDeauthorizeArgs = {
  input: MyAppInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRegisterBotCommandsArgs = {
  input: RegisterCommands;
};


export type MutationRegisterBotPrefixArgs = {
  input: RegisterPrefix;
};


export type MutationRemoveCollectionUserArgs = {
  input: RemoveCollectionUserInput;
};


export type MutationRemoveFromCollectionArgs = {
  input: AddToCollectionInput;
};


export type MutationResetOauthSecretArgs = {
  input: MyAppInput;
};


export type MutationSaveNoteArgs = {
  input: SaveNoteInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSetExperimentArgs = {
  input: SetExperimentInput;
};


export type MutationStarUploadArgs = {
  input: StarUploadInput;
};


export type MutationToggleNoteShareArgs = {
  input: Scalars['Int']['input'];
};


export type MutationToggleUserRankArgs = {
  input: AddRank;
};


export type MutationTransferGroupOwnershipArgs = {
  input: TransferOwnershipInput;
};


export type MutationUpdateChatArgs = {
  input: UpdateChatInput;
};


export type MutationUpdateChatRankArgs = {
  input: UpdateRank;
};


export type MutationUpdateChatRankOrderArgs = {
  input: UpdateRankOrder;
};


export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput;
};


export type MutationUpdateCollectionUserPermissionsArgs = {
  input: UpdateCollectionUserPermissionsInput;
};


export type MutationUpdateEmojiArgs = {
  input: UpdateEmojiInput;
};


export type MutationUpdateOauthAppArgs = {
  input: UpdateAppInput;
};


export type MutationUpdateOauthUserArgs = {
  input: UpdateAppUserInput;
};


export type MutationUpdateStatusArgs = {
  input: UpdateUserStatusInput;
};


export type MutationUpdateUploadArgs = {
  input: UpdateUploadInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type MyAppInput = {
  id: Scalars['String']['input'];
};

export type Note = {
  __typename?: 'Note';
  createdAt: Scalars['Date']['output'];
  data?: Maybe<WorkspaceNote>;
  id: Scalars['Int']['output'];
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
  noteId: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['Date']['output'];
  dismissed: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  route?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Float']['output'];
};

export type OauthApp = {
  __typename?: 'OauthApp';
  bot?: Maybe<PartialUserBase>;
  botId?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  oauthUser: OauthUser;
  oauthUsers: Array<OauthUser>;
  private: Scalars['Boolean']['output'];
  redirectUri?: Maybe<Scalars['String']['output']>;
  scopes: Scalars['String']['output'];
  secret?: Maybe<Scalars['String']['output']>;
  shortCode?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
  verified: Scalars['Boolean']['output'];
};

export type OauthConsentApp = {
  __typename?: 'OauthConsentApp';
  bot?: Maybe<PartialUserBase>;
  botId?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  private: Scalars['Boolean']['output'];
  redirectUri?: Maybe<Scalars['String']['output']>;
  scopes: Scalars['String']['output'];
  shortCode?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
  verified: Scalars['Boolean']['output'];
};

export type OauthUser = {
  __typename?: 'OauthUser';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  manage: Scalars['Boolean']['output'];
  oauthAppId: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type PagedMessagesInput = {
  associationId: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  position?: InputMaybe<ScrollPosition>;
  search?: InputMaybe<MessagesSearch>;
};

export type Pager = {
  __typename?: 'Pager';
  currentPage: Scalars['Int']['output'];
  endIndex: Scalars['Int']['output'];
  endPage: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  pages: Array<Scalars['Float']['output']>;
  startIndex: Scalars['Int']['output'];
  startPage: Scalars['Int']['output'];
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedChatAuditLogResponse = {
  __typename?: 'PaginatedChatAuditLogResponse';
  items: Array<ChatAuditLog>;
  pager: Pager;
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
  bot: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  moderator: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
};

export type PartialUserFriend = {
  __typename?: 'PartialUserFriend';
  administrator: Scalars['Boolean']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  blocked?: Maybe<Scalars['Boolean']['output']>;
  bot: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  moderator: Scalars['Boolean']['output'];
  nameColor?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<FriendNickname>;
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
  bot: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  domain: Array<Domain>;
  friend?: Maybe<FriendStatus>;
  friends?: Maybe<Array<Friend>>;
  id: Scalars['Int']['output'];
  insights: UserInsights;
  integrations: Array<Integration>;
  moderator: Scalars['Boolean']['output'];
  mutualCollections: Array<Collection>;
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
  id: Scalars['Int']['output'];
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

export type Prefix = {
  __typename?: 'Prefix';
  commands: Array<LookupPrefix>;
  prefix: Scalars['String']['output'];
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

export type ProfileLayoutComponent = {
  __typename?: 'ProfileLayoutComponent';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  props?: Maybe<ProfileLayoutProps>;
};

export type ProfileLayoutConfig = {
  __typename?: 'ProfileLayoutConfig';
  containerMargin?: Maybe<Scalars['Float']['output']>;
  showStatsSidebar: Scalars['Boolean']['output'];
};

export type ProfileLayoutObject = {
  __typename?: 'ProfileLayoutObject';
  columns: Array<ProfileLayoutColumn>;
};

export type ProfileLayoutPropLink = {
  __typename?: 'ProfileLayoutPropLink';
  color: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
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

export type Providers = {
  __typename?: 'Providers';
  anilist: Scalars['Boolean']['output'];
  lastfm: Scalars['Boolean']['output'];
  mal: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  autoCollectRule: AutoCollectRule;
  autoCollectRules: Array<AutoCollectRule>;
  autoCollects: PaginatedCollectionResponse;
  availableChatPermissions: Array<ChatPermission>;
  blockedUsers: Array<BlockedUser>;
  chat: Chat;
  chatAuditLog: PaginatedChatAuditLogResponse;
  chatInvite?: Maybe<ChatInvite>;
  chats: Array<Chat>;
  collection?: Maybe<Collection>;
  collections?: Maybe<PaginatedCollectionResponse>;
  coreState: CoreState;
  currentUser?: Maybe<User>;
  domains: Array<Domain>;
  experiments: Array<ExperimentType>;
  friends: Array<Friend>;
  gallery: PaginatedUploadResponse;
  getAuthorizedApps: Array<OauthApp>;
  getMail: Scalars['JSON']['output'];
  lookupBotPrefix: Prefix;
  mailboxes: Array<ListResponse>;
  messages: Array<Message>;
  messagesPaged: PaginatedMessageResponse;
  note?: Maybe<Note>;
  oauthApp: OauthApp;
  oauthAppConsent: OauthConsentApp;
  oauthApps: Array<OauthApp>;
  setupStep: Scalars['Int']['output'];
  trackedUserIds: Array<Scalars['Float']['output']>;
  trackedUsers: Array<PartialUserFriend>;
  unreadMail: Scalars['Int']['output'];
  user?: Maybe<PartialUserPublic>;
  userEmoji: Array<ChatEmoji>;
  weather: Weather;
  workspaces: Array<Workspace>;
};


export type QueryAutoCollectRuleArgs = {
  input: AutoCollectRuleQueryInput;
};


export type QueryAutoCollectsArgs = {
  input: UserCollectionsInput;
};


export type QueryChatArgs = {
  input: ChatInput;
};


export type QueryChatAuditLogArgs = {
  input: AuditLogInput;
};


export type QueryChatInviteArgs = {
  input: InviteInput;
};


export type QueryChatsArgs = {
  input?: InputMaybe<ChatsInput>;
};


export type QueryCollectionArgs = {
  input: CollectionInput;
};


export type QueryCollectionsArgs = {
  input?: InputMaybe<UserCollectionsInput>;
};


export type QueryFriendsArgs = {
  input?: InputMaybe<FriendsInput>;
};


export type QueryGalleryArgs = {
  input: GalleryInput;
};


export type QueryGetMailArgs = {
  input: GetMailInput;
};


export type QueryLookupBotPrefixArgs = {
  input: LookupPrefixInput;
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


export type QueryOauthAppArgs = {
  input: MyAppInput;
};


export type QueryOauthAppConsentArgs = {
  input: MyAppInput;
};


export type QueryUserArgs = {
  input: UserProfileInput;
};

/** The category that the permission is categorized into for Communications ranks. */
export enum RankPermissionGroup {
  Admin = 'ADMIN',
  General = 'GENERAL',
  Manage = 'MANAGE',
  Options = 'OPTIONS'
}

export type RegisterCommand = {
  command: Scalars['String']['input'];
  description: Scalars['String']['input'];
};

export type RegisterCommands = {
  commands: Array<RegisterCommand>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  inviteKey?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type RegisterPrefix = {
  prefix: Scalars['String']['input'];
};

export type RemoveCollectionUserInput = {
  collectionId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
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
  associationId: Scalars['Int']['input'];
  attachments?: Array<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  embeds?: InputMaybe<Array<EmbedInput>>;
  replyId?: InputMaybe<Scalars['Int']['input']>;
};

export type Session = {
  __typename?: 'Session';
  createdAt?: Maybe<Scalars['Date']['output']>;
  expiredAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['Int']['output'];
  info?: Maybe<SessionInfo>;
  name?: Maybe<Scalars['String']['output']>;
  oauthAppId?: Maybe<Scalars['String']['output']>;
  scopes: Scalars['String']['output'];
  /** Only populated for `API` type sessions on `currentUser`. */
  token?: Maybe<Scalars['String']['output']>;
  type: SessionType;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userId: Scalars['Float']['output'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  accessedFrom: Array<AccessedFrom>;
};

export type SessionInput = {
  type: SessionType;
};

export enum SessionType {
  Api = 'API',
  Oauth = 'OAUTH',
  WebSession = 'WEB_SESSION'
}

export type SetExperimentInput = {
  key: Scalars['String']['input'];
  /** Admin only. */
  userId?: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['Int']['input'];
};

export type Star = {
  __typename?: 'Star';
  attachment: Upload;
  attachmentId: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type StarUploadInput = {
  /** The upload's attachment ID, not numerical ID, such as 1d7fe21g3jd1.png */
  attachment: Scalars['String']['input'];
};

export type StarUploadResponse = {
  __typename?: 'StarUploadResponse';
  star?: Maybe<Star>;
  status: Scalars['Boolean']['output'];
};

export type Stats = {
  __typename?: 'Stats';
  announcements: Scalars['Float']['output'];
  collectionItems: Scalars['Float']['output'];
  collections: Scalars['Float']['output'];
  docs: Scalars['Float']['output'];
  hours?: Maybe<Scalars['JSON']['output']>;
  messageGraph?: Maybe<DataLabelsGraph>;
  messages: Scalars['Float']['output'];
  pulse: Scalars['Float']['output'];
  pulseGraph?: Maybe<DataLabelsGraph>;
  pulses: Scalars['Float']['output'];
  uploadGraph?: Maybe<DataLabelsGraph>;
  uploads: Scalars['Float']['output'];
  usage?: Maybe<Scalars['Float']['output']>;
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

export type ThemeEngineTheme = {
  __typename?: 'ThemeEngineTheme';
  colors: ThemeEngineColors;
  dark?: Maybe<Scalars['Boolean']['output']>;
};

export type ThemeEngineThemes = {
  __typename?: 'ThemeEngineThemes';
  amoled: ThemeEngineTheme;
  dark: ThemeEngineTheme;
  light: ThemeEngineTheme;
};

/** Whether the user should be added, or removed from the group. */
export enum ToggleUser {
  Add = 'ADD',
  Remove = 'REMOVE'
}

export type TransferOwnershipInput = {
  associationId: Scalars['Int']['input'];
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
  /** User to transfer to. */
  userId: Scalars['Int']['input'];
};

export type UpdateAppInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  private: Scalars['Boolean']['input'];
  redirectUri?: InputMaybe<Scalars['String']['input']>;
  verified: Scalars['Boolean']['input'];
};

export type UpdateAppUserInput = {
  id: Scalars['String']['input'];
  manage: Scalars['Boolean']['input'];
  oauthAppId: Scalars['String']['input'];
};

export type UpdateChatInput = {
  associationId: Scalars['Int']['input'];
  /** Can only be null or undefined to unset or do not modify the group background respectively. Use the REST API to set one. */
  background?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /** Can only be null or undefined to unset or do not modify the group icon respectively. Use the REST API to set one. */
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCollectionInput = {
  collectionId: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  shareLink?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateCollectionUserPermissionsInput = {
  collectionId: Scalars['Int']['input'];
  configure: Scalars['Boolean']['input'];
  read: Scalars['Boolean']['input'];
  userId: Scalars['Int']['input'];
  write: Scalars['Boolean']['input'];
};

export type UpdateEmojiInput = {
  associationId: Scalars['Int']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UpdateRank = {
  associationId: Scalars['Int']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissionsMap: Array<Scalars['String']['input']>;
  rankId: Scalars['String']['input'];
};

export type UpdateRankOrder = {
  associationId: Scalars['Int']['input'];
  /** Order if the rank, this is actually reversed from expected index value, so rankIds[0] is the highest priority rank. */
  rankIds: Array<Scalars['String']['input']>;
};

export type UpdateUploadInput = {
  name: Scalars['String']['input'];
  uploadId: Scalars['Int']['input'];
};

export type UpdateUserInput = {
  darkTheme?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discordPrecache?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  excludedCollections?: InputMaybe<Array<Scalars['Float']['input']>>;
  friendRequests?: InputMaybe<UserFriendRequestPrivacy>;
  groupPrivacy?: InputMaybe<UserGroupPrivacy>;
  insights?: InputMaybe<Scalars['String']['input']>;
  itemsPerPage?: InputMaybe<Scalars['Float']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  nameColor?: InputMaybe<Scalars['String']['input']>;
  privacyPolicyAccepted?: InputMaybe<Scalars['Boolean']['input']>;
  profileLayout?: InputMaybe<Scalars['JSON']['input']>;
  publicProfile?: InputMaybe<Scalars['Boolean']['input']>;
  pulse?: InputMaybe<Scalars['Boolean']['input']>;
  storedStatus?: InputMaybe<Scalars['String']['input']>;
  themeEngine?: InputMaybe<Scalars['JSON']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  weatherUnit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserStatusInput = {
  storedStatus: UserStoredStatus;
};

export type Upload = {
  __typename?: 'Upload';
  attachment: Scalars['String']['output'];
  autoCollectApproval?: Maybe<AutoCollectApproval>;
  collections: Array<Collection>;
  createdAt: Scalars['Date']['output'];
  /** Non-deletable items are used for profile pictures, banners, etc and are not visible in the Gallery page by default, and cannot be deleted. */
  deletable: Scalars['Boolean']['output'];
  fileSize: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  item?: Maybe<CollectionItem>;
  items: Array<CollectionItem>;
  name?: Maybe<Scalars['String']['output']>;
  originalFilename?: Maybe<Scalars['String']['output']>;
  starred?: Maybe<Star>;
  /** This is used for OCR scanned text from images. */
  textMetadata?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
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
  /** Whether the user is a bot user. */
  bot: Scalars['Boolean']['output'];
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
  /** Whether the user can be sent a friend request. */
  friendRequests: UserFriendRequestPrivacy;
  friends: Array<Friend>;
  /** Whether the user can be added directly into groups. */
  groupPrivacy: UserGroupPrivacy;
  id: Scalars['Int']['output'];
  insights: UserInsights;
  integrations: Array<Integration>;
  /** @deprecated Invisible URLs are no longer available as of TPUv2/NEXT. */
  invisibleURLs: Scalars['Boolean']['output'];
  inviteId?: Maybe<Scalars['Float']['output']>;
  itemsPerPage: Scalars['Float']['output'];
  language: Scalars['String']['output'];
  moderator: Scalars['Boolean']['output'];
  mutualCollections: Array<Collection>;
  /**
   * The user's name color in Communications.
   * @deprecated Replaced by ranks
   */
  nameColor?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Array<FriendNickname>>;
  notifications: Array<Notification>;
  oauthAppId?: Maybe<Scalars['String']['output']>;
  /** How many AutoCollect approvals the user needs to approve/reject. */
  pendingAutoCollects?: Maybe<Scalars['Float']['output']>;
  plan?: Maybe<Plan>;
  privacyPolicyAccepted?: Maybe<Scalars['Boolean']['output']>;
  profileLayout?: Maybe<Scalars['JSON']['output']>;
  publicProfile: Scalars['Boolean']['output'];
  /** Whether the user has TPU Pulse Telemetry enabled. */
  pulse: Scalars['Boolean']['output'];
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
  themeEngine?: Maybe<Scalars['JSON']['output']>;
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


export type UserSessionsArgs = {
  input?: InputMaybe<SessionInput>;
};

export type UserCollectionsInput = {
  filter?: Array<CollectionFilter>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: Scalars['Float']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Preference of who can send them friend requests. */
export enum UserFriendRequestPrivacy {
  Everyone = 'EVERYONE',
  Nobody = 'NOBODY'
}

/** Preference of who can add them directly into groups. */
export enum UserGroupPrivacy {
  Friends = 'FRIENDS',
  Nobody = 'NOBODY'
}

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
  name?: Maybe<Scalars['String']['output']>;
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
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user: PartialUserBase;
  userId: Scalars['Int']['output'];
  users: Array<WorkspaceUser>;
};

export type WorkspaceFolder = {
  __typename?: 'WorkspaceFolder';
  children: Array<Note>;
  createdAt: Scalars['Date']['output'];
  folderId?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
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
  id: Scalars['Int']['output'];
  /** The unique identifier between the User and the Workspace. */
  identifier?: Maybe<Scalars['String']['output']>;
  read: Scalars['Boolean']['output'];
  recipientId: Scalars['Int']['output'];
  sender: PartialUserBase;
  senderId: Scalars['Int']['output'];
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

export type AddChatUsersMutationVariables = Exact<{
  input: AddChatUser;
}>;


export type AddChatUsersMutation = { __typename?: 'Mutation', addChatUsers: { __typename?: 'GenericSuccessObject', success: boolean } };

export type ChatAuditLogQueryVariables = Exact<{
  input: AuditLogInput;
}>;


export type ChatAuditLogQuery = { __typename?: 'Query', chatAuditLog: { __typename?: 'PaginatedChatAuditLogResponse', items: Array<{ __typename?: 'ChatAuditLog', id: string, userId: number, chatId: number, category: AuditLogCategory, actionType: AuditLogActionType, message: string, createdAt: any, updatedAt: any }>, pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } } };

export type ChatsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ChatsQueryQuery = { __typename?: 'Query', chats: Array<{ __typename?: 'Chat', id: number, background?: string | null, description?: string | null, type: string, name: string, unread?: number | null, userId?: number | null, icon?: string | null, createdAt: any, updatedAt: any, legacyUserId?: number | null, _redisSortDate?: string | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, association?: { __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, lastRead?: number | null, notifications: string, legacyUserId?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null } | null, users: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, lastRead?: number | null, notifications: string, legacyUserId?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }> };

export type CreateChatMutationVariables = Exact<{
  input: CreateChatInput;
}>;


export type CreateChatMutation = { __typename?: 'Mutation', createChat: { __typename?: 'Chat', id: number, association?: { __typename?: 'ChatAssociation', id: number } | null } };

export type AddChatRankMutationVariables = Exact<{
  input: CreateRank;
}>;


export type AddChatRankMutation = { __typename?: 'Mutation', addChatRank: { __typename?: 'ChatRank', id: string } };

export type DeleteEmojiMutationVariables = Exact<{
  input: DeleteEmojiInput;
}>;


export type DeleteEmojiMutation = { __typename?: 'Mutation', deleteEmoji: { __typename?: 'GenericSuccessObject', success: boolean } };

export type DeleteGroupMutationVariables = Exact<{
  input: DangerZoneChatInput;
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: { __typename?: 'GenericSuccessObject', success: boolean } };

export type LeaveChatMutationVariables = Exact<{
  input: LeaveChatInput;
}>;


export type LeaveChatMutation = { __typename?: 'Mutation', leaveChat: { __typename?: 'GenericSuccessObject', success: boolean } };

export type InvalidateChatInviteMutationVariables = Exact<{
  input: InvalidateInviteInput;
}>;


export type InvalidateChatInviteMutation = { __typename?: 'Mutation', invalidateChatInvite: { __typename?: 'GenericSuccessObject', success: boolean } };

export type DeleteChatRankMutationVariables = Exact<{
  input: DeleteRank;
}>;


export type DeleteChatRankMutation = { __typename?: 'Mutation', deleteChatRank: { __typename?: 'GenericSuccessObject', success: boolean } };

export type ChatInviteQueryVariables = Exact<{
  input: InviteInput;
}>;


export type ChatInviteQuery = { __typename?: 'Query', chatInvite?: { __typename?: 'ChatInvite', id: string, userId: number, chatId: number, rankId?: string | null, createdAt: any, updatedAt: any, expiredAt?: any | null, invalidated: boolean, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, chat: { __typename?: 'Chat', id: number, name: string, description?: string | null, background?: string | null, icon?: string | null, type: string, users: Array<{ __typename?: 'ChatAssociation', id: number }> }, rank?: { __typename?: 'ChatRank', id: string, color?: string | null, name: string } | null } | null };

export type GetInvitesForChatQueryVariables = Exact<{
  input: ChatInput;
}>;


export type GetInvitesForChatQuery = { __typename?: 'Query', chat: { __typename?: 'Chat', invites: Array<{ __typename?: 'ChatInvite', id: string, userId: number, createdAt: any, rankId?: string | null, updatedAt: any, expiredAt?: any | null, invalidated: boolean }> } };

export type JoinChatFromInviteMutationVariables = Exact<{
  input: JoinChatFromInviteInput;
}>;


export type JoinChatFromInviteMutation = { __typename?: 'Mutation', joinChatFromInvite: { __typename?: 'ChatAssociation', id: number } };

export type CreateChatInviteMutationVariables = Exact<{
  input: CreateInviteInput;
}>;


export type CreateChatInviteMutation = { __typename?: 'Mutation', createChatInvite: { __typename?: 'ChatInvite', id: string, userId: number, chatId: number, rankId?: string | null, createdAt: any, updatedAt: any, expiredAt?: any | null, invalidated: boolean } };

export type StandardMessageFragment = { __typename?: 'Message', id: number, createdAt: any, updatedAt: any, chatId: number, userId?: number | null, content?: string | null, type?: MessageType | null, edited: boolean, editedAt?: any | null, replyId?: number | null, legacyUserId?: number | null, pinned: boolean, emoji?: Array<{ __typename?: 'ChatEmoji', name?: string | null, icon?: string | null, id: string, chatId: number }> | null, embeds: Array<{ __typename?: 'Embed', type: string, data?: any | null }>, reply?: { __typename?: 'Message', content?: string | null, userId?: number | null, id: number, legacyUserId?: number | null, readReceipts: Array<{ __typename?: 'ChatAssociation', id: number, userId?: number | null, lastRead?: number | null, legacyUserId?: number | null }>, embeds: Array<{ __typename?: 'Embed', type: string }>, legacyUser?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null } | null, legacyUser?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null, readReceipts: Array<{ __typename?: 'ChatAssociation', id: number, userId?: number | null, lastRead?: number | null, legacyUserId?: number | null }> } & { ' $fragmentName'?: 'StandardMessageFragment' };

export type MessagesQueryVariables = Exact<{
  input: InfiniteMessagesInput;
}>;


export type MessagesQuery = { __typename?: 'Query', messages: Array<(
    { __typename?: 'Message' }
    & { ' $fragmentRefs'?: { 'StandardMessageFragment': StandardMessageFragment } }
  )> };

export type PagedMessagesQueryVariables = Exact<{
  input: PagedMessagesInput;
}>;


export type PagedMessagesQuery = { __typename?: 'Query', messagesPaged: { __typename?: 'PaginatedMessageResponse', items: Array<(
      { __typename?: 'Message' }
      & { ' $fragmentRefs'?: { 'StandardMessageFragment': StandardMessageFragment } }
    )>, pager: (
      { __typename?: 'Pager' }
      & { ' $fragmentRefs'?: { 'PagerFragment': PagerFragment } }
    ) } };

export type AvailableChatPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableChatPermissionsQuery = { __typename?: 'Query', availableChatPermissions: Array<{ __typename?: 'ChatPermission', id: string, description: string, name: string, createdAt?: any | null, updatedAt?: any | null, group: RankPermissionGroup }> };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', id: number } };

export type ToggleUserRankMutationVariables = Exact<{
  input: AddRank;
}>;


export type ToggleUserRankMutation = { __typename?: 'Mutation', toggleUserRank: { __typename?: 'GenericSuccessObject', success: boolean } };

export type TransferGroupOwnershipMutationVariables = Exact<{
  input: TransferOwnershipInput;
}>;


export type TransferGroupOwnershipMutation = { __typename?: 'Mutation', transferGroupOwnership: { __typename?: 'Chat', userId?: number | null } };

export type UpdateChatMutationVariables = Exact<{
  input: UpdateChatInput;
}>;


export type UpdateChatMutation = { __typename?: 'Mutation', updateChat: { __typename?: 'Chat', id: number } };

export type UpdateEmojiMutationVariables = Exact<{
  input: UpdateEmojiInput;
}>;


export type UpdateEmojiMutation = { __typename?: 'Mutation', updateEmoji: { __typename?: 'ChatEmoji', name?: string | null } };

export type UpdateChatRankMutationVariables = Exact<{
  input: UpdateRank;
}>;


export type UpdateChatRankMutation = { __typename?: 'Mutation', updateChatRank: { __typename?: 'ChatRank', id: string } };

export type UpdateChatRankOrderMutationVariables = Exact<{
  input: UpdateRankOrder;
}>;


export type UpdateChatRankOrderMutation = { __typename?: 'Mutation', updateChatRankOrder: Array<{ __typename?: 'ChatRank', id: string }> };

export type CollectionQueryVariables = Exact<{
  input: CollectionInput;
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: number, name: string, image?: string | null, userId: number, shareLink?: string | null, shared?: boolean | null, itemCount?: number | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, preview?: { __typename?: 'CollectionItem', id: number, attachment: { __typename?: 'Upload', attachment: string, id: number } } | null, users: Array<{ __typename?: 'CollectionUser', id: number, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null, sender?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null } | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } } | null };

export type UserLightCollectionsQueryQueryVariables = Exact<{
  input: UserCollectionsInput;
}>;


export type UserLightCollectionsQueryQuery = { __typename?: 'Query', collections?: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', id: number, name: string }> } | null };

export type UserCollectionsQueryQueryVariables = Exact<{
  input: UserCollectionsInput;
}>;


export type UserCollectionsQueryQuery = { __typename?: 'Query', collections?: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', id: number, name: string, image?: string | null, userId: number, shareLink?: string | null, shared?: boolean | null, itemCount?: number | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, preview?: { __typename?: 'CollectionItem', attachment: { __typename?: 'Upload', attachment: string, id: number } } | null, users: Array<{ __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, administrator: boolean, moderator: boolean, avatar?: string | null } | null, sender?: { __typename?: 'PartialUserBase', username: string, id: number, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null } | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } }>, pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } } | null };

export type GetExperimentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExperimentsQuery = { __typename?: 'Query', experiments: Array<{ __typename?: 'ExperimentType', id: string, value: number, description?: string | null, createdAt?: any | null }> };

export type SetExperimentMutationVariables = Exact<{
  input: SetExperimentInput;
}>;


export type SetExperimentMutation = { __typename?: 'Mutation', setExperiment: { __typename?: 'Experiment', value: string, key: string } };

export type CoreStateQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CoreStateQueryQuery = { __typename?: 'Query', friends: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId: number, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, status: UserStatus } }>, experiments: Array<{ __typename?: 'ExperimentType', id: string, value: number, description?: string | null, createdAt?: any | null }>, workspaces: Array<{ __typename?: 'Workspace', id: number, name: string, userId: number, createdAt: any, updatedAt: any, icon?: string | null, folders: Array<{ __typename?: 'WorkspaceFolder', id: number, createdAt: any, updatedAt: any, name: string, workspaceId: number, folderId?: number | null, children: Array<{ __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null }> }> }>, chats: Array<{ __typename?: 'Chat', id: number, description?: string | null, type: string, background?: string | null, unread?: number | null, name: string, userId?: number | null, icon?: string | null, createdAt: any, updatedAt: any, legacyUserId?: number | null, _redisSortDate?: string | null, invites: Array<{ __typename?: 'ChatInvite', id: string, userId: number, createdAt: any, rankId?: string | null, updatedAt: any, expiredAt?: any | null, invalidated: boolean }>, association?: { __typename?: 'ChatAssociation', id: number, hidden?: boolean | null, chatId: number, permissions: Array<string>, userId?: number | null, rank: string, createdAt: any, lastRead?: number | null, notifications: string, legacyUserId?: number | null } | null, users: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, createdAt: any, lastRead?: number | null, legacyUserId?: number | null, ranksMap: Array<string> }>, recipient?: { __typename?: 'PartialUserBase', id: number } | null, ranks: Array<{ __typename?: 'ChatRank', id: string, color?: string | null, name: string, userId: number, createdAt?: any | null, chatId: number, updatedAt?: any | null, managed: boolean, index: number, permissionsMap: Array<string> }> }>, coreState: { __typename?: 'CoreState', name: string, release: string, hostname: string, hostnameWithProtocol: string, registrations: boolean, officialInstance: boolean, termsNoteId?: string | null, privacyNoteId?: string | null, inviteAFriend: boolean, preTrustedDomains: Array<string>, hostnames: Array<string>, _redis: string, server: string, finishedSetup: boolean, domain: string, uptime: number, uptimeSys: number, commitVersion: string, connection: { __typename?: 'Connection', ip: string }, announcements: Array<{ __typename?: 'Announcement', userId: number, content: string, type?: string | null, id: number, createdAt?: any | null, updatedAt?: any | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } }>, stats: { __typename?: 'CoreStats', users: number, announcements: number, usage?: number | null, collections: number, collectionItems: number, uploads: number, invites: number, inviteMilestone: number, pulse: number, pulses: number, docs: number, messages: number, chats: number, hours?: any | null, uploadGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, messageGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, pulseGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null }, maintenance: { __typename?: 'Maintenance', enabled: boolean, message?: string | null, statusPage?: string | null }, providers: { __typename?: 'Providers', anilist: boolean, lastfm: boolean, mal: boolean }, features: { __typename?: 'Features', communications: boolean, collections: boolean, autoCollects: boolean, workspaces: boolean, insights: boolean } }, collections?: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', id: number, name: string, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } }> } | null, currentUser?: { __typename?: 'User', username: string, email: string, pulse: boolean, groupPrivacy: UserGroupPrivacy, friendRequests: UserFriendRequestPrivacy, profileLayout?: any | null, description?: string | null, administrator: boolean, darkTheme: boolean, emailVerified: boolean, banned: boolean, createdAt: any, inviteId?: number | null, discordPrecache: boolean, avatar?: string | null, domainId: number, totpEnable: boolean, quota: number, moderator: boolean, subscriptionId?: number | null, itemsPerPage: number, banner?: string | null, pendingAutoCollects?: number | null, scopes?: string | null, status: UserStatus, storedStatus: UserStoredStatus, weatherUnit: string, themeEngine?: any | null, xp: number, publicProfile: boolean, privacyPolicyAccepted?: boolean | null, excludedCollections?: Array<number> | null, id: number, language: string, nameColor?: string | null, insights: UserInsights, alternatePasswords?: Array<{ __typename?: 'AlternatePassword', scopes: string, totp: boolean, name: string }> | null, plan?: { __typename?: 'Plan', quotaMax: number, color?: string | null, internalName: string, name: string, icon: string, id: number } | null, domain?: { __typename?: 'Domain', active: boolean, domain: string, id: number } | null, badges: Array<{ __typename?: 'Badge', color?: string | null, icon?: string | null, id: number, image?: string | null, name: string, priority?: number | null, tooltip?: string | null }>, subscription?: { __typename?: 'TPUSubscription', cancelled: boolean, metadata: { __typename?: 'SubscriptionMetadata', hours: number } } | null, notifications: Array<{ __typename?: 'Notification', id: number, dismissed: boolean, message: string, route?: string | null, createdAt: any }>, integrations: Array<{ __typename?: 'Integration', type: string, providerUsername?: string | null, providerUserId?: number | null, id: number, error?: string | null, expiresAt?: any | null }> } | null, trackedUsers: Array<{ __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, blocked?: boolean | null, status: UserStatus, nameColor?: string | null, bot: boolean, nickname?: { __typename?: 'FriendNickname', nickname: string } | null }>, blockedUsers: Array<{ __typename?: 'BlockedUser', id: string, userId: number, createdAt: any, updatedAt: any, blockedUserId: number, silent: boolean }>, userEmoji: Array<{ __typename?: 'ChatEmoji', id: string, userId: number, chatId: number, icon?: string | null, name?: string | null, createdAt: any, updatedAt: any }> };

export type WeatherQueryVariables = Exact<{ [key: string]: never; }>;


export type WeatherQuery = { __typename?: 'Query', weather: { __typename?: 'Weather', temp?: number | null, feels_like?: number | null, temp_min?: number | null, temp_max?: number | null, pressure?: number | null, humidity?: number | null, wind_speed?: number | null, wind_deg?: number | null, clouds?: number | null, visibility?: number | null, error?: boolean | null, cached?: boolean | null, icon?: string | null, main?: string | null } };

export type OauthAppConsentQueryVariables = Exact<{
  input: MyAppInput;
}>;


export type OauthAppConsentQuery = { __typename?: 'Query', availableChatPermissions: Array<{ __typename?: 'ChatPermission', id: string, description: string, name: string, createdAt?: any | null, updatedAt?: any | null, group: RankPermissionGroup }>, oauthAppConsent: { __typename?: 'OauthConsentApp', id: string, name: string, icon?: string | null, shortCode?: string | null, verified: boolean, redirectUri?: string | null, description?: string | null, scopes: string, userId: number, botId?: number | null, private: boolean, token?: string | null, bot?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, avatar?: string | null, bot: boolean } | null } };

export type AddBotToChatMutationVariables = Exact<{
  input: AddBotToChatInput;
}>;


export type AddBotToChatMutation = { __typename?: 'Mutation', addBotToChat: { __typename?: 'ChatAssociation', id: number } };

export type CreateOauthAppMutationVariables = Exact<{
  input: CreateAppInput;
}>;


export type CreateOauthAppMutation = { __typename?: 'Mutation', createOauthApp: { __typename?: 'OauthApp', id: string } };

export type CreateBotOauthAppMutationVariables = Exact<{
  input: CreateBotInput;
}>;


export type CreateBotOauthAppMutation = { __typename?: 'Mutation', createBotOauthApp: { __typename?: 'PartialUserBase', id: number } };

export type LookupBotPrefixQueryVariables = Exact<{
  input: LookupPrefixInput;
}>;


export type LookupBotPrefixQuery = { __typename?: 'Query', lookupBotPrefix: { __typename?: 'Prefix', prefix: string, commands: Array<{ __typename?: 'LookupPrefix', command: string, description: string, botId: number }> } };

export type DevAppsQueryVariables = Exact<{ [key: string]: never; }>;


export type DevAppsQuery = { __typename?: 'Query', oauthApps: Array<{ __typename?: 'OauthApp', id: string, name: string, icon?: string | null, shortCode?: string | null, verified: boolean, redirectUri?: string | null, secret?: string | null, description?: string | null, scopes: string, userId: number, private: boolean, user: { __typename?: 'PartialUserBase', username: string } }> };

export type DevAppQueryVariables = Exact<{
  input: MyAppInput;
}>;


export type DevAppQuery = { __typename?: 'Query', oauthApp: { __typename?: 'OauthApp', id: string, name: string, icon?: string | null, shortCode?: string | null, verified: boolean, redirectUri?: string | null, secret?: string | null, description?: string | null, scopes: string, userId: number, private: boolean, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, bot: boolean }, oauthUsers: Array<{ __typename?: 'OauthUser', id: string, userId: number, oauthAppId: string, manage: boolean, active: boolean, createdAt: any, user: { __typename?: 'PartialUserBase', username: string, id: number } }>, bot?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, avatar?: string | null, bot: boolean } | null } };

export type AddOauthUserMutationVariables = Exact<{
  input: AddAppUserInput;
}>;


export type AddOauthUserMutation = { __typename?: 'Mutation', addOauthUser: { __typename?: 'OauthUser', id: string } };

export type UpdateOauthAppMutationVariables = Exact<{
  input: UpdateAppInput;
}>;


export type UpdateOauthAppMutation = { __typename?: 'Mutation', updateOauthApp: { __typename?: 'GenericSuccessObject', success: boolean } };

export type DeleteOauthAppMutationVariables = Exact<{
  input: MyAppInput;
}>;


export type DeleteOauthAppMutation = { __typename?: 'Mutation', deleteOauthApp: { __typename?: 'GenericSuccessObject', success: boolean } };

export type ResetOauthSecretMutationVariables = Exact<{
  input: MyAppInput;
}>;


export type ResetOauthSecretMutation = { __typename?: 'Mutation', resetOauthSecret: { __typename?: 'GenericSuccessObject', success: boolean } };

export type UpdateOauthUserMutationVariables = Exact<{
  input: UpdateAppUserInput;
}>;


export type UpdateOauthUserMutation = { __typename?: 'Mutation', updateOauthUser: { __typename?: 'OauthUser', id: string } };

export type PagerFragment = { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } & { ' $fragmentName'?: 'PagerFragment' };

export type GalleryQueryVariables = Exact<{
  input: GalleryInput;
}>;


export type GalleryQuery = { __typename?: 'Query', gallery: { __typename?: 'PaginatedUploadResponse', pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number }, items: Array<{ __typename?: 'Upload', id: number, createdAt: any, updatedAt: any, attachment: string, userId: number, name?: string | null, originalFilename?: string | null, type: string, fileSize: number, deletable: boolean, textMetadata?: string | null, autoCollectApproval?: { __typename?: 'AutoCollectApproval', id: number, autoCollectRuleId: number } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null, collections: Array<{ __typename?: 'Collection', id: number, name: string }>, item?: { __typename?: 'CollectionItem', id: number, pinned: boolean } | null, starred?: { __typename?: 'Star', id: number, userId: number, attachmentId: number } | null }> } };

export type BlockUserMutationVariables = Exact<{
  input: BlockUserInput;
}>;


export type BlockUserMutation = { __typename?: 'Mutation', blockUser: { __typename?: 'GenericSuccessObject', success: boolean } };

export type ChangeUsernameMutationVariables = Exact<{
  input: ChangeUsernameInput;
}>;


export type ChangeUsernameMutation = { __typename?: 'Mutation', changeUsername: boolean };

export type ChangeUserPasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangeUserPasswordMutation = { __typename?: 'Mutation', changeUserPassword: boolean };

export type ChangeUserEmailMutationVariables = Exact<{
  input: ChangeEmailInput;
}>;


export type ChangeUserEmailMutation = { __typename?: 'Mutation', changeUserEmail: boolean };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', Troplo?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, goose?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, bytedefined?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, electrics01?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, Jolt707?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, Avinera?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, Spy?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null };

export type FriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type FriendsQuery = { __typename?: 'Query', friends: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId: number, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, status: UserStatus } }> };

export type UserQueryVariables = Exact<{
  input: UserProfileInput;
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'PartialUserPublic', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, bot: boolean, banned: boolean, banner?: string | null, description?: string | null, friend?: FriendStatus | null, insights: UserInsights, publicProfile: boolean, quota: number, xp?: number | null, badges: Array<{ __typename?: 'Badge', id: number, name: string, description?: string | null, tooltip?: string | null, image?: string | null, icon?: string | null, color?: string | null, unlocked: boolean, priority?: number | null }>, friends?: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId: number, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, otherUser: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } }> | null, plan: { __typename?: 'Plan', id: number, name: string, quotaMax: number, price: number, features?: string | null, color?: string | null, internalName: string, purchasable: boolean, internalFeatures?: string | null, icon: string }, platforms?: Array<{ __typename?: 'Platform', platform: string, id: string, lastSeen: string, status: string }> | null, profileLayout?: { __typename?: 'ProfileLayout', version: number, layout: { __typename?: 'ProfileLayoutObject', columns: Array<{ __typename?: 'ProfileLayoutColumn', rows: Array<{ __typename?: 'ProfileLayoutComponent', name: string, id: string, props?: { __typename?: 'ProfileLayoutProps', height?: number | null, friendsOnly?: boolean | null, display?: number | null, type?: string | null, links?: Array<{ __typename?: 'ProfileLayoutPropLink', name: string, url: string, color: string }> | null, children?: Array<{ __typename?: 'ProfileLayoutComponent', name: string, id: string, props?: { __typename?: 'ProfileLayoutProps', height?: number | null, friendsOnly?: boolean | null, display?: number | null, type?: string | null, links?: Array<{ __typename?: 'ProfileLayoutPropLink', name: string, url: string, color: string }> | null } | null }> | null } | null }> }> }, config: { __typename?: 'ProfileLayoutConfig', containerMargin?: number | null, showStatsSidebar: boolean } } | null, stats?: { __typename?: 'Stats', hours?: any | null, messages: number, usage?: number | null, collections: number, collectionItems: number, uploads: number, pulse: number, pulses: number, docs: number, uploadGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, messageGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, pulseGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null } | null, mutualCollections: Array<{ __typename?: 'Collection', id: number, shareLink?: string | null, avatar?: string | null, itemCount?: number | null, image?: string | null, name: string, banner?: string | null }> } | null };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: boolean };

export type GetUserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQueryQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', username: string, email: string, description?: string | null, administrator: boolean, darkTheme: boolean, emailVerified: boolean, banned: boolean, inviteId?: number | null, discordPrecache: boolean, avatar?: string | null, domainId: number, totpEnable: boolean, quota: number, moderator: boolean, subscriptionId?: number | null, itemsPerPage: number, banner?: string | null, status: UserStatus, storedStatus: UserStoredStatus, weatherUnit: string, themeEngine?: any | null, xp: number, publicProfile: boolean, privacyPolicyAccepted?: boolean | null, excludedCollections?: Array<number> | null, id: number, language: string, nameColor?: string | null, insights: UserInsights, alternatePasswords?: Array<{ __typename?: 'AlternatePassword', scopes: string, totp: boolean, name: string }> | null, plan?: { __typename?: 'Plan', quotaMax: number, color?: string | null, internalName: string, name: string, icon: string, id: number } | null, domain?: { __typename?: 'Domain', active: boolean, domain: string, id: number } | null, badges: Array<{ __typename?: 'Badge', color?: string | null, icon?: string | null, id: number, image?: string | null, name: string, priority?: number | null, tooltip?: string | null }>, subscription?: { __typename?: 'TPUSubscription', cancelled: boolean, metadata: { __typename?: 'SubscriptionMetadata', hours: number } } | null, notifications: Array<{ __typename?: 'Notification', id: number, dismissed: boolean, message: string, route?: string | null }>, integrations: Array<{ __typename?: 'Integration', type: string, providerUsername?: string | null, providerUserId?: number | null, providerUserCache?: any | null, createdAt: any, id: number, error?: string | null, expiresAt?: any | null }> } | null };

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


export type NoteQuery = { __typename?: 'Query', note?: { __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null, permissions?: { __typename?: 'NotePermissionsMetadata', modify: boolean, read: boolean, configure: boolean } | null, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null, versions: Array<{ __typename?: 'NoteVersion', id: string, noteId: number, userId: number, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null }> } | null };

export type SaveNoteMutationVariables = Exact<{
  input: SaveNoteInput;
}>;


export type SaveNoteMutation = { __typename?: 'Mutation', saveNote: { __typename?: 'Note', id: number, name: string, workspaceFolderId: number } };

export type ToggleNoteShareMutationVariables = Exact<{
  input: Scalars['Int']['input'];
}>;


export type ToggleNoteShareMutation = { __typename?: 'Mutation', toggleNoteShare: { __typename?: 'Note', shareLink?: string | null } };

export const StandardMessageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}}]}}]}}]} as unknown as DocumentNode<StandardMessageFragment, unknown>;
export const PagerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pager"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pager"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]} as unknown as DocumentNode<PagerFragment, unknown>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const AddChatUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChatUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddChatUser"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChatUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AddChatUsersMutation, AddChatUsersMutationVariables>;
export const ChatAuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatAuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditLogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"actionType"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]}}]}}]} as unknown as DocumentNode<ChatAuditLogQuery, ChatAuditLogQueryVariables>;
export const ChatsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_redisSortDate"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<ChatsQueryQuery, ChatsQueryQueryVariables>;
export const CreateChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateChatMutation, CreateChatMutationVariables>;
export const AddChatRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChatRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChatRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddChatRankMutation, AddChatRankMutationVariables>;
export const DeleteEmojiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEmoji"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteEmojiInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEmoji"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteEmojiMutation, DeleteEmojiMutationVariables>;
export const DeleteGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DangerZoneChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const LeaveChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LeaveChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LeaveChatMutation, LeaveChatMutationVariables>;
export const InvalidateChatInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InvalidateChatInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InvalidateInviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invalidateChatInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<InvalidateChatInviteMutation, InvalidateChatInviteMutationVariables>;
export const DeleteChatRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteChatRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChatRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteChatRankMutation, DeleteChatRankMutationVariables>;
export const ChatInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ChatInviteQuery, ChatInviteQueryVariables>;
export const GetInvitesForChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvitesForChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}}]}}]}}]}}]} as unknown as DocumentNode<GetInvitesForChatQuery, GetInvitesForChatQueryVariables>;
export const JoinChatFromInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinChatFromInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JoinChatFromInviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinChatFromInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<JoinChatFromInviteMutation, JoinChatFromInviteMutationVariables>;
export const CreateChatInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChatInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChatInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}}]}}]}}]} as unknown as DocumentNode<CreateChatInviteMutation, CreateChatInviteMutationVariables>;
export const MessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Messages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InfiniteMessagesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardMessage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}}]}}]}}]} as unknown as DocumentNode<MessagesQuery, MessagesQueryVariables>;
export const PagedMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PagedMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagedMessagesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagesPaged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardMessage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pager"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pager"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pager"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]} as unknown as DocumentNode<PagedMessagesQuery, PagedMessagesQueryVariables>;
export const AvailableChatPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AvailableChatPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableChatPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"group"}}]}}]}}]} as unknown as DocumentNode<AvailableChatPermissionsQuery, AvailableChatPermissionsQueryVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const ToggleUserRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleUserRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleUserRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ToggleUserRankMutation, ToggleUserRankMutationVariables>;
export const TransferGroupOwnershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransferGroupOwnership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransferOwnershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferGroupOwnership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<TransferGroupOwnershipMutation, TransferGroupOwnershipMutationVariables>;
export const UpdateChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateChatMutation, UpdateChatMutationVariables>;
export const UpdateEmojiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmoji"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEmojiInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmoji"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateEmojiMutation, UpdateEmojiMutationVariables>;
export const UpdateChatRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChatRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChatRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateChatRankMutation, UpdateChatRankMutationVariables>;
export const UpdateChatRankOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChatRankOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRankOrder"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChatRankOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateChatRankOrderMutation, UpdateChatRankOrderMutationVariables>;
export const CollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Collection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionQuery, CollectionQueryVariables>;
export const UserLightCollectionsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserLightCollectionsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCollectionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UserLightCollectionsQueryQuery, UserLightCollectionsQueryQueryVariables>;
export const UserCollectionsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserCollectionsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCollectionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]}}]}}]} as unknown as DocumentNode<UserCollectionsQueryQuery, UserCollectionsQueryQueryVariables>;
export const GetExperimentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExperiments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetExperimentsQuery, GetExperimentsQueryVariables>;
export const SetExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetExperimentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode<SetExperimentMutation, SetExperimentMutationVariables>;
export const CoreStateQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CoreStateQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"experiments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"invites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"legacyUserId"}},{"kind":"Field","name":{"kind":"Name","value":"ranksMap"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_redisSortDate"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ranks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMap"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"coreState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"release"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"hostnameWithProtocol"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"}},{"kind":"Field","name":{"kind":"Name","value":"usage"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"collectionItems"}},{"kind":"Field","name":{"kind":"Name","value":"uploadGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pulseGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploads"}},{"kind":"Field","name":{"kind":"Name","value":"invites"}},{"kind":"Field","name":{"kind":"Name","value":"inviteMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"pulses"}},{"kind":"Field","name":{"kind":"Name","value":"docs"}},{"kind":"Field","name":{"kind":"Name","value":"messages"}},{"kind":"Field","name":{"kind":"Name","value":"chats"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maintenance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrations"}},{"kind":"Field","name":{"kind":"Name","value":"officialInstance"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anilist"}},{"kind":"Field","name":{"kind":"Name","value":"lastfm"}},{"kind":"Field","name":{"kind":"Name","value":"mal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"termsNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"privacyNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"}},{"kind":"Field","name":{"kind":"Name","value":"insights"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inviteAFriend"}},{"kind":"Field","name":{"kind":"Name","value":"preTrustedDomains"}},{"kind":"Field","name":{"kind":"Name","value":"hostnames"}},{"kind":"Field","name":{"kind":"Name","value":"_redis"}},{"kind":"Field","name":{"kind":"Name","value":"server"}},{"kind":"Field","name":{"kind":"Name","value":"finishedSetup"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"uptime"}},{"kind":"Field","name":{"kind":"Name","value":"uptimeSys"}},{"kind":"Field","name":{"kind":"Name","value":"commitVersion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"groupPrivacy"}},{"kind":"Field","name":{"kind":"Name","value":"friendRequests"}},{"kind":"Field","name":{"kind":"Name","value":"profileLayout"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"darkTheme"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"inviteId"}},{"kind":"Field","name":{"kind":"Name","value":"discordPrecache"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"domainId"}},{"kind":"Field","name":{"kind":"Name","value":"totpEnable"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"pendingAutoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePasswords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"weatherUnit"}},{"kind":"Field","name":{"kind":"Name","value":"themeEngine"}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"excludedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dismissed"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerUsername"}},{"kind":"Field","name":{"kind":"Name","value":"providerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"trackedUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"blocked"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nickname"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"blockedUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"blockedUserId"}},{"kind":"Field","name":{"kind":"Name","value":"silent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CoreStateQueryQuery, CoreStateQueryQueryVariables>;
export const WeatherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"temp"}},{"kind":"Field","name":{"kind":"Name","value":"feels_like"}},{"kind":"Field","name":{"kind":"Name","value":"temp_min"}},{"kind":"Field","name":{"kind":"Name","value":"temp_max"}},{"kind":"Field","name":{"kind":"Name","value":"pressure"}},{"kind":"Field","name":{"kind":"Name","value":"humidity"}},{"kind":"Field","name":{"kind":"Name","value":"wind_speed"}},{"kind":"Field","name":{"kind":"Name","value":"wind_deg"}},{"kind":"Field","name":{"kind":"Name","value":"clouds"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"cached"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"main"}}]}}]}}]} as unknown as DocumentNode<WeatherQuery, WeatherQueryVariables>;
export const OauthAppConsentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OauthAppConsent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableChatPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"group"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauthAppConsent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUri"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"botId"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<OauthAppConsentQuery, OauthAppConsentQueryVariables>;
export const AddBotToChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBotToChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddBotToChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBotToChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddBotToChatMutation, AddBotToChatMutationVariables>;
export const CreateOauthAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOauthApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateOauthAppMutation, CreateOauthAppMutationVariables>;
export const CreateBotOauthAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBotOauthApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBotInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBotOauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateBotOauthAppMutation, CreateBotOauthAppMutationVariables>;
export const LookupBotPrefixDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LookupBotPrefix"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LookupPrefixInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lookupBotPrefix"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"commands"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"command"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"botId"}}]}}]}}]}}]} as unknown as DocumentNode<LookupBotPrefixQuery, LookupBotPrefixQueryVariables>;
export const DevAppsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DevApps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oauthApps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUri"}},{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<DevAppsQuery, DevAppsQueryVariables>;
export const DevAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DevApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUri"}},{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauthUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"oauthAppId"}},{"kind":"Field","name":{"kind":"Name","value":"manage"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}}]}}]}}]}}]} as unknown as DocumentNode<DevAppQuery, DevAppQueryVariables>;
export const AddOauthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddOauthUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddAppUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOauthUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddOauthUserMutation, AddOauthUserMutationVariables>;
export const UpdateOauthAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOauthApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateOauthAppMutation, UpdateOauthAppMutationVariables>;
export const DeleteOauthAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOauthApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteOauthAppMutation, DeleteOauthAppMutationVariables>;
export const ResetOauthSecretDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetOauthSecret"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetOauthSecret"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ResetOauthSecretMutation, ResetOauthSecretMutationVariables>;
export const UpdateOauthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOauthUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAppUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOauthUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateOauthUserMutation, UpdateOauthUserMutationVariables>;
export const GalleryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Gallery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GalleryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gallery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoCollectApproval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollectRuleId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"originalFilename"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"deletable"}},{"kind":"Field","name":{"kind":"Name","value":"textMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}}]}},{"kind":"Field","name":{"kind":"Name","value":"starred"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GalleryQuery, GalleryQueryVariables>;
export const BlockUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BlockUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<BlockUserMutation, BlockUserMutationVariables>;
export const ChangeUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeUsernameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangeUsernameMutation, ChangeUsernameMutationVariables>;
export const ChangeUserPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUserPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUserPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;
export const ChangeUserEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUserEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUserEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangeUserEmailMutation, ChangeUserEmailMutationVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"Troplo"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"Troplo","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"goose"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"goose","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"bytedefined"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"bytedefined","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"electrics01"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"electrics01","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"Jolt707"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"Jolt707","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"Avinera"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"Avinera","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"Spy"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"Spy","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const FriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<FriendsQuery, FriendsQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"unlocked"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"friend"}},{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"otherUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"features"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"purchasable"}},{"kind":"Field","name":{"kind":"Name","value":"internalFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"platforms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeen"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileLayout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"friendsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"friendsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"containerMargin"}},{"kind":"Field","name":{"kind":"Name","value":"showStatsSidebar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}},{"kind":"Field","name":{"kind":"Name","value":"messages"}},{"kind":"Field","name":{"kind":"Name","value":"usage"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"collectionItems"}},{"kind":"Field","name":{"kind":"Name","value":"uploadGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pulseGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploads"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"pulses"}},{"kind":"Field","name":{"kind":"Name","value":"docs"}}]}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"mutualCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"darkTheme"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"inviteId"}},{"kind":"Field","name":{"kind":"Name","value":"discordPrecache"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"domainId"}},{"kind":"Field","name":{"kind":"Name","value":"totpEnable"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePasswords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"weatherUnit"}},{"kind":"Field","name":{"kind":"Name","value":"themeEngine"}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"excludedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dismissed"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"route"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerUsername"}},{"kind":"Field","name":{"kind":"Name","value":"providerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"providerUserCache"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQueryQuery, GetUserQueryQueryVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const CreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const NoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Note"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]}}]}}]} as unknown as DocumentNode<NoteQuery, NoteQueryVariables>;
export const SaveNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}}]}}]}}]} as unknown as DocumentNode<SaveNoteMutation, SaveNoteMutationVariables>;
export const ToggleNoteShareDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleNoteShare"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleNoteShare"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shareLink"}}]}}]}}]} as unknown as DocumentNode<ToggleNoteShareMutation, ToggleNoteShareMutationVariables>;