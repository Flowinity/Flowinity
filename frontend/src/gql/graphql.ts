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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: { input: any; output: any; }
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
  user?: Maybe<User>;
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

export type Collection = {
  __typename?: 'Collection';
  autoCollectApprovals: Array<AutoCollectApproval>;
  id: Scalars['Float']['output'];
  image?: Maybe<Scalars['String']['output']>;
  itemCount?: Maybe<Scalars['Float']['output']>;
  items: Array<CollectionItem>;
  name: Scalars['String']['output'];
  preview?: Maybe<CollectionItem>;
  recipient?: Maybe<CollectionUser>;
  shareLink?: Maybe<Scalars['String']['output']>;
  shared?: Maybe<Scalars['Boolean']['output']>;
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
  users: Array<CollectionUser>;
};

export type CollectionCache = {
  __typename?: 'CollectionCache';
  autoCollectApprovals: Array<AutoCollectApproval>;
  id: Scalars['Float']['output'];
  image?: Maybe<Scalars['String']['output']>;
  itemCount?: Maybe<Scalars['Float']['output']>;
  items: Array<CollectionItem>;
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
  id: Scalars['Float']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  read: Scalars['Boolean']['output'];
  recipientId?: Maybe<Scalars['Float']['output']>;
  sender?: Maybe<PartialUserBase>;
  senderId?: Maybe<Scalars['Float']['output']>;
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
  stats: Stats;
  /** Workspaces Note ID for the Terms of Service. */
  termsNoteId?: Maybe<Scalars['String']['output']>;
  /** Uptime of the TPU Server in seconds. */
  uptime: Scalars['Float']['output'];
  /** Uptime of the system in seconds. */
  uptimeSys: Scalars['Float']['output'];
};

export type DataLabelsGraph = {
  __typename?: 'DataLabelsGraph';
  data: Array<Scalars['Float']['output']>;
  labels: Array<Scalars['String']['output']>;
};

export type Domain = {
  __typename?: 'Domain';
  /** @deprecated Use `active` instead. */
  DNSProvisioned: Scalars['Boolean']['output'];
  active: Scalars['Boolean']['output'];
  /** @deprecated Cloudflare integration was removed in TPUv2. */
  advanced: Scalars['Boolean']['output'];
  /** @deprecated Granular user control was removed in TPUv2. */
  customUserEligibility: Array<Scalars['Int']['output']>;
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
  zone: Scalars['String']['output'];
};

export type Experiment = {
  __typename?: 'Experiment';
  key: Scalars['String']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
  value: Scalars['String']['output'];
};

export type Features = {
  __typename?: 'Features';
  autoCollects: Scalars['Boolean']['output'];
  collections: Scalars['Boolean']['output'];
  communications: Scalars['Boolean']['output'];
  insights: Scalars['Boolean']['output'];
  workspaces: Scalars['Boolean']['output'];
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

export type Integration = {
  __typename?: 'Integration';
  error?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  register: LoginResponse;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type Notification = {
  __typename?: 'Notification';
  dismissed: Scalars['Boolean']['output'];
  id: Scalars['Float']['output'];
  message: Scalars['String']['output'];
  route?: Maybe<Scalars['String']['output']>;
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Float']['output'];
};

export type PartialUserBase = {
  __typename?: 'PartialUserBase';
  administrator: Scalars['Boolean']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  moderator: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
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
  features?: Maybe<Array<Scalars['String']['output']>>;
  icon: Scalars['String']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  internalFeatures?: Maybe<Array<Scalars['String']['output']>>;
  internalName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  price: Scalars['Float']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  purchasable: Scalars['Boolean']['output'];
  quotaMax: Scalars['Float']['output'];
};

export type Providers = {
  __typename?: 'Providers';
  anilist: Scalars['Boolean']['output'];
  lastfm: Scalars['Boolean']['output'];
  mal: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  coreState: CoreState;
  currentUser: User;
  getSetupStep: Scalars['Float']['output'];
  userCollections: Array<CollectionCache>;
};


export type QueryUserCollectionsArgs = {
  input?: InputMaybe<UserCollectionsInput>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  inviteKey?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
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
  usagePercentage: Scalars['Float']['output'];
  users: Scalars['Float']['output'];
};

export type SubRule = {
  __typename?: 'SubRule';
  id: Scalars['Float']['output'];
  operator: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  cancelled: Scalars['Boolean']['output'];
  cancelledAt: Scalars['DateTime']['output'];
  expiredAt: Scalars['DateTime']['output'];
  metadata: SubscriptionMetadata;
  paymentId: Scalars['Float']['output'];
  planId: Scalars['Float']['output'];
  price: Scalars['Float']['output'];
  user: PartialUserBase;
  userId: Scalars['Float']['output'];
};

export type SubscriptionMetadata = {
  __typename?: 'SubscriptionMetadata';
  hours: Scalars['Float']['output'];
};

export type ThemeEngine = {
  __typename?: 'ThemeEngine';
  baseTheme: Scalars['String']['output'];
  customCSS?: Maybe<Scalars['String']['output']>;
  defaults?: Maybe<ThemeEngineThemes>;
  deviceSync: Scalars['Boolean']['output'];
  fluidGradient: Scalars['Boolean']['output'];
  gradientOffset: Scalars['Float']['output'];
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
  alternatePasswords: Array<AlternatePassword>;
  autoCollectRules: Array<AutoCollectRule>;
  avatar?: Maybe<Scalars['String']['output']>;
  badges: Array<Badge>;
  banned: Scalars['Boolean']['output'];
  /** UserV2 banner. */
  banner: Scalars['String']['output'];
  darkTheme: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  discordPrecache: Scalars['Boolean']['output'];
  domain?: Maybe<Domain>;
  domainId: Scalars['Float']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  /** Collections that are excluded from the Collections filter in Gallery. */
  excludedCollections?: Maybe<Array<Scalars['Float']['output']>>;
  experiments?: Maybe<Array<Experiment>>;
  /** @deprecated Fake paths are no longer available as of TPUv2/NEXT. */
  fakePath: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  insights: Scalars['String']['output'];
  integrations: Array<Integration>;
  /** @deprecated Invisible URLs are no longer available as of TPUv2/NEXT. */
  invisibleURLs: Scalars['Boolean']['output'];
  inviteId: Scalars['Float']['output'];
  itemsPerPage: Scalars['Float']['output'];
  language: Scalars['String']['output'];
  moderator: Scalars['Boolean']['output'];
  /** The user's name color in Communications. */
  nameColor?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Array<FriendNickname>>;
  notifications: Array<Notification>;
  passwordResetEnabled: Scalars['Boolean']['output'];
  plan?: Maybe<Plan>;
  privacyPolicyAccepted?: Maybe<Scalars['Boolean']['output']>;
  publicProfile: Scalars['Boolean']['output'];
  /** How much the user has uploaded in bytes. */
  quota: Scalars['Float']['output'];
  /** User status/presence shown to other users. */
  status: Scalars['String']['output'];
  /** User status/presence that has `invisible` and is shown to the current user. */
  storedStatus: Scalars['String']['output'];
  /** @deprecated Subdomains are no longer available as of TPUv2/NEXT. */
  subdomainId?: Maybe<Scalars['Float']['output']>;
  subscription?: Maybe<Subscription>;
  /** Subscriptions are no longer used as they were in TPUv1, and are now used to store metadata for permanent Gold subscriptions. */
  subscriptionId: Scalars['Float']['output'];
  themeEngine: ThemeEngine;
  /** @deprecated Replaced with `themeEngine`, used in legacy clients such as legacy.privateuploader.com. */
  themeId: Scalars['Float']['output'];
  totpEnable: Scalars['Boolean']['output'];
  /** @deprecated Hidden upload usernames are no longer available as of TPUv2/NEXT. */
  uploadNameHidden: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
  weatherUnit: Scalars['String']['output'];
  /** How much the user has donated to PrivateUploader. (Likely unused in unofficial instances.) */
  xp: Scalars['Float']['output'];
};

export type UserCollectionsInput = {
  search?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token: string, user: { __typename?: 'LoginUser', id: number, username: string, email: string } } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponse', token: string, user: { __typename?: 'LoginUser', id: number, username: string, email: string } } };

export type UserCollectionsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type UserCollectionsQueryQuery = { __typename?: 'Query', userCollections: Array<{ __typename?: 'CollectionCache', id: number, name: string, image?: string | null, userId: number, shareLink?: string | null, shared?: boolean | null, itemCount?: number | null, preview?: { __typename?: 'CollectionItem', attachment: { __typename?: 'Upload', attachment: string } } | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', configure: boolean, read: boolean, write: boolean }, users: Array<{ __typename?: 'CollectionUser', id: number, configure: boolean, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: string, administrator: boolean, moderator: boolean, avatar?: string | null } | null }> }> };

export type CoreStateQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CoreStateQueryQuery = { __typename?: 'Query', coreState: { __typename?: 'CoreState', name: string, release: string, hostname: string, hostnameWithProtocol: string, registrations: boolean, officialInstance: boolean, termsNoteId?: string | null, privacyNoteId?: string | null, inviteAFriend: boolean, preTrustedDomains: Array<string>, hostnames: Array<string>, _redis: string, server: string, finishedSetup: boolean, domain: string, uptime: number, uptimeSys: number, commitVersion: string, announcements: Array<{ __typename?: 'Announcement', userId: number, content: string, type?: string | null, user: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: string, administrator: boolean, moderator: boolean, avatar?: string | null } }>, stats: { __typename?: 'Stats', users: number, announcements: number, usage: number, usagePercentage: number, collections: number, collectionItems: number, uploads: number, invites: number, inviteMilestone: number, pulse: number, pulses: number, docs: number, messages: number, chats: number, hours?: Array<string> | null, uploadGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> }, messageGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> }, pulseGraph: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } }, maintenance: { __typename?: 'Maintenance', enabled: boolean, message?: string | null, statusPage?: string | null }, providers: { __typename?: 'Providers', anilist: boolean, lastfm: boolean, mal: boolean }, features: { __typename?: 'Features', communications: boolean, collections: boolean, autoCollects: boolean, workspaces: boolean, insights: boolean } } };

export type GetUserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQueryQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', username: string, email: string, passwordResetEnabled: boolean, description: string, administrator: boolean, darkTheme: boolean, emailVerified: boolean, banned: boolean, inviteId: number, discordPrecache: boolean, avatar?: string | null, domainId: number, totpEnable: boolean, quota: number, moderator: boolean, subscriptionId: number, itemsPerPage: number, banner: string, status: string, storedStatus: string, weatherUnit: string, xp: number, publicProfile: boolean, privacyPolicyAccepted?: boolean | null, excludedCollections?: Array<number> | null, id: number, language: string, nameColor?: string | null, insights: string, alternatePasswords: Array<{ __typename?: 'AlternatePassword', scopes: string, totp: boolean, name: string }>, themeEngine: { __typename?: 'ThemeEngine', fluidGradient: boolean, gradientOffset: number, version: number, deviceSync: boolean, showOnProfile: boolean, baseTheme: string, customCSS?: string | null, theme: { __typename?: 'ThemeEngineThemes', dark: { __typename?: 'ThemeEngineTheme', dark?: boolean | null, colors: { __typename?: 'ThemeEngineColors', primary: string, logo1: string, logo2: string, secondary: string, accent: string, error: string, info: string, success: string, warning: string, card: string, toolbar: string, sheet: string, text: string, dark: string, gold: string, background: string, background2: string } }, light: { __typename?: 'ThemeEngineTheme', dark?: boolean | null }, amoled: { __typename?: 'ThemeEngineTheme', dark?: boolean | null, colors: { __typename?: 'ThemeEngineColors', primary: string, logo1: string, logo2: string, secondary: string, accent: string, error: string, info: string, success: string, warning: string, card: string, toolbar: string, sheet: string, text: string, dark: string, gold: string, background: string, background2: string } } } }, plan?: { __typename?: 'Plan', quotaMax: number, color?: string | null, internalName: string, name: string, icon: string } | null, domain?: { __typename?: 'Domain', active: boolean, domain: string, id: number } | null, badges: Array<{ __typename?: 'Badge', color?: string | null, icon?: string | null, id: number, image?: string | null, name: string, priority?: number | null, tooltip?: string | null }>, subscription?: { __typename?: 'Subscription', cancelled: boolean, metadata: { __typename?: 'SubscriptionMetadata', hours: number } } | null, notifications: Array<{ __typename?: 'Notification', id: number, dismissed: boolean, message: string, route?: string | null }>, integrations: Array<{ __typename?: 'Integration', type: string, providerUsername?: string | null, providerUserId?: number | null, id: number, error?: string | null, expiresAt?: any | null }> } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UserCollectionsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserCollectionsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}}]}}]}}]} as unknown as DocumentNode<UserCollectionsQueryQuery, UserCollectionsQueryQueryVariables>;
export const CoreStateQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CoreStateQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coreState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"release"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"hostnameWithProtocol"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"}},{"kind":"Field","name":{"kind":"Name","value":"usage"}},{"kind":"Field","name":{"kind":"Name","value":"usagePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"collectionItems"}},{"kind":"Field","name":{"kind":"Name","value":"uploadGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pulseGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploads"}},{"kind":"Field","name":{"kind":"Name","value":"invites"}},{"kind":"Field","name":{"kind":"Name","value":"inviteMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"pulses"}},{"kind":"Field","name":{"kind":"Name","value":"docs"}},{"kind":"Field","name":{"kind":"Name","value":"messages"}},{"kind":"Field","name":{"kind":"Name","value":"chats"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maintenance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrations"}},{"kind":"Field","name":{"kind":"Name","value":"officialInstance"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anilist"}},{"kind":"Field","name":{"kind":"Name","value":"lastfm"}},{"kind":"Field","name":{"kind":"Name","value":"mal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"termsNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"privacyNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"}},{"kind":"Field","name":{"kind":"Name","value":"insights"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inviteAFriend"}},{"kind":"Field","name":{"kind":"Name","value":"preTrustedDomains"}},{"kind":"Field","name":{"kind":"Name","value":"hostnames"}},{"kind":"Field","name":{"kind":"Name","value":"_redis"}},{"kind":"Field","name":{"kind":"Name","value":"server"}},{"kind":"Field","name":{"kind":"Name","value":"finishedSetup"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"uptime"}},{"kind":"Field","name":{"kind":"Name","value":"uptimeSys"}},{"kind":"Field","name":{"kind":"Name","value":"commitVersion"}}]}}]}}]} as unknown as DocumentNode<CoreStateQueryQuery, CoreStateQueryQueryVariables>;
export const GetUserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"passwordResetEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"darkTheme"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"inviteId"}},{"kind":"Field","name":{"kind":"Name","value":"discordPrecache"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"domainId"}},{"kind":"Field","name":{"kind":"Name","value":"totpEnable"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePasswords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"weatherUnit"}},{"kind":"Field","name":{"kind":"Name","value":"themeEngine"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"logo1"}},{"kind":"Field","name":{"kind":"Name","value":"logo2"}},{"kind":"Field","name":{"kind":"Name","value":"secondary"}},{"kind":"Field","name":{"kind":"Name","value":"accent"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"warning"}},{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"toolbar"}},{"kind":"Field","name":{"kind":"Name","value":"sheet"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"background2"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dark"}}]}},{"kind":"Field","name":{"kind":"Name","value":"light"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amoled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"colors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"logo1"}},{"kind":"Field","name":{"kind":"Name","value":"logo2"}},{"kind":"Field","name":{"kind":"Name","value":"secondary"}},{"kind":"Field","name":{"kind":"Name","value":"accent"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"warning"}},{"kind":"Field","name":{"kind":"Name","value":"card"}},{"kind":"Field","name":{"kind":"Name","value":"toolbar"}},{"kind":"Field","name":{"kind":"Name","value":"sheet"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"dark"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"background2"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fluidGradient"}},{"kind":"Field","name":{"kind":"Name","value":"gradientOffset"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"deviceSync"}},{"kind":"Field","name":{"kind":"Name","value":"showOnProfile"}},{"kind":"Field","name":{"kind":"Name","value":"baseTheme"}},{"kind":"Field","name":{"kind":"Name","value":"customCSS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"excludedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dismissed"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"route"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerUsername"}},{"kind":"Field","name":{"kind":"Name","value":"providerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQueryQuery, GetUserQueryQueryVariables>;