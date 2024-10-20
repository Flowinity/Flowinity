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
};

export type Announcement = {
  __typename?: 'Announcement';
  banner: Scalars['Boolean']['output'];
  bannerExpiry?: Maybe<Scalars['Date']['output']>;
  bannerIcon?: Maybe<Scalars['String']['output']>;
  bannerText?: Maybe<Scalars['String']['output']>;
  bannerType?: Maybe<BannerType>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  draft: Scalars['Boolean']['output'];
  flowinityUser?: Maybe<FlowinityUser>;
  flowinityUserId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  /** Resolvable URL to an image */
  image: Scalars['String']['output'];
  showOnMainPage: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type AnnouncementsInput = {
  banner?: InputMaybe<Scalars['Boolean']['input']>;
  /** The page number. Ignored if banner is true. */
  page?: InputMaybe<Scalars['Int']['input']>;
  /** The search term to filter announcements by. */
  search?: InputMaybe<Scalars['String']['input']>;
};

export type AnnouncementsPaginated = {
  __typename?: 'AnnouncementsPaginated';
  items: Array<Announcement>;
  pager: Pager;
};

/** The type of the banner */
export enum BannerType {
  Error = 'error',
  Info = 'info',
  None = 'none',
  Success = 'success',
  Warning = 'warning'
}

export type CreateAnnouncement = {
  banner: Scalars['Boolean']['input'];
  bannerExpiry?: InputMaybe<Scalars['DateTimeISO']['input']>;
  bannerIcon?: InputMaybe<Scalars['String']['input']>;
  bannerText?: InputMaybe<Scalars['String']['input']>;
  bannerType?: InputMaybe<BannerType>;
  content: Scalars['String']['input'];
  description: Scalars['String']['input'];
  draft: Scalars['Boolean']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  showOnMainPage: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type FlowinityUser = {
  __typename?: 'FlowinityUser';
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAnnouncement: Announcement;
  updateAnnouncement: Announcement;
};


export type MutationCreateAnnouncementArgs = {
  input: CreateAnnouncement;
};


export type MutationUpdateAnnouncementArgs = {
  input: UpdateAnnouncement;
};

export type Pager = {
  __typename?: 'Pager';
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  announcement?: Maybe<Announcement>;
  announcements: AnnouncementsPaginated;
  information: Scalars['String']['output'];
  status: Array<StatusMonitor>;
  user: FlowinityUser;
};


export type QueryAnnouncementArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  showOnMainPage?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAnnouncementsArgs = {
  input: AnnouncementsInput;
};

/** The status of the monitor */
export enum Status {
  Down = 'DOWN',
  Maintenance = 'MAINTENANCE',
  Pending = 'PENDING',
  Up = 'UP'
}

export type StatusMonitor = {
  __typename?: 'StatusMonitor';
  name: Scalars['String']['output'];
  status: Status;
};

export type UpdateAnnouncement = {
  banner: Scalars['Boolean']['input'];
  bannerExpiry?: InputMaybe<Scalars['DateTimeISO']['input']>;
  bannerIcon?: InputMaybe<Scalars['String']['input']>;
  bannerText?: InputMaybe<Scalars['String']['input']>;
  bannerType?: InputMaybe<BannerType>;
  content: Scalars['String']['input'];
  description: Scalars['String']['input'];
  draft: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  showOnMainPage: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type AnnouncementQueryVariables = Exact<{
  announcementId?: InputMaybe<Scalars['String']['input']>;
  showOnMainPage?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AnnouncementQuery = { __typename?: 'Query', announcement?: { __typename?: 'Announcement', id: string, title: string, description: string, draft: boolean, content?: string | null, createdAt: any, updatedAt: any, banner: boolean, bannerType?: BannerType | null, bannerText?: string | null, bannerExpiry?: any | null, image: string, bannerIcon?: string | null, showOnMainPage: boolean, flowinityUser?: { __typename?: 'FlowinityUser', username: string, avatar?: string | null } | null } | null };

export type AnnouncementsQueryVariables = Exact<{
  input: AnnouncementsInput;
}>;


export type AnnouncementsQuery = { __typename?: 'Query', announcements: { __typename?: 'AnnouncementsPaginated', items: Array<{ __typename?: 'Announcement', id: string, title: string, description: string, createdAt: any, updatedAt: any, image: string, draft: boolean, banner: boolean, bannerText?: string | null, bannerExpiry?: any | null, bannerType?: BannerType | null, flowinityUserId: number, bannerIcon?: string | null, showOnMainPage: boolean }>, pager: { __typename?: 'Pager', totalItems: number, totalPages: number } } };

export type CreateAnnouncementMutationVariables = Exact<{
  input: CreateAnnouncement;
}>;


export type CreateAnnouncementMutation = { __typename?: 'Mutation', createAnnouncement: { __typename?: 'Announcement', id: string, title: string, description: string, createdAt: any, updatedAt: any, image: string, content?: string | null, banner: boolean, bannerText?: string | null, bannerExpiry?: any | null, bannerType?: BannerType | null, flowinityUserId: number, draft: boolean, flowinityUser?: { __typename?: 'FlowinityUser', id: number, username: string, avatar?: string | null } | null } };

export type UpdateAnnouncementMutationVariables = Exact<{
  input: UpdateAnnouncement;
}>;


export type UpdateAnnouncementMutation = { __typename?: 'Mutation', updateAnnouncement: { __typename?: 'Announcement', id: string, title: string, description: string, createdAt: any, updatedAt: any, image: string, content?: string | null, banner: boolean, bannerText?: string | null, bannerExpiry?: any | null, bannerType?: BannerType | null, flowinityUserId: number, draft: boolean, flowinityUser?: { __typename?: 'FlowinityUser', id: number, username: string, avatar?: string | null } | null } };

export type StatusPageQueryVariables = Exact<{ [key: string]: never; }>;


export type StatusPageQuery = { __typename?: 'Query', status: Array<{ __typename?: 'StatusMonitor', name: string, status: Status }> };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'FlowinityUser', id: number, username: string, avatar?: string | null } };


export const AnnouncementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Announcement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"announcementId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showOnMainPage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"announcement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"announcementId"}}},{"kind":"Argument","name":{"kind":"Name","value":"showOnMainPage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showOnMainPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"draft"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerType"}},{"kind":"Field","name":{"kind":"Name","value":"bannerText"}},{"kind":"Field","name":{"kind":"Name","value":"bannerExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"bannerIcon"}},{"kind":"Field","name":{"kind":"Name","value":"showOnMainPage"}},{"kind":"Field","name":{"kind":"Name","value":"flowinityUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<AnnouncementQuery, AnnouncementQueryVariables>;
export const AnnouncementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Announcements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnnouncementsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"announcements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"draft"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerText"}},{"kind":"Field","name":{"kind":"Name","value":"bannerExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"bannerType"}},{"kind":"Field","name":{"kind":"Name","value":"flowinityUserId"}},{"kind":"Field","name":{"kind":"Name","value":"bannerIcon"}},{"kind":"Field","name":{"kind":"Name","value":"showOnMainPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]}}]}}]} as unknown as DocumentNode<AnnouncementsQuery, AnnouncementsQueryVariables>;
export const CreateAnnouncementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAnnouncement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAnnouncement"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAnnouncement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"flowinityUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerText"}},{"kind":"Field","name":{"kind":"Name","value":"bannerExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"bannerType"}},{"kind":"Field","name":{"kind":"Name","value":"flowinityUserId"}},{"kind":"Field","name":{"kind":"Name","value":"draft"}}]}}]}}]} as unknown as DocumentNode<CreateAnnouncementMutation, CreateAnnouncementMutationVariables>;
export const UpdateAnnouncementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAnnouncement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAnnouncement"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAnnouncement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"flowinityUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerText"}},{"kind":"Field","name":{"kind":"Name","value":"bannerExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"bannerType"}},{"kind":"Field","name":{"kind":"Name","value":"flowinityUserId"}},{"kind":"Field","name":{"kind":"Name","value":"draft"}}]}}]}}]} as unknown as DocumentNode<UpdateAnnouncementMutation, UpdateAnnouncementMutationVariables>;
export const StatusPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StatusPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<StatusPageQuery, StatusPageQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;