import { Field, InputType } from "type-graphql"
import { ProfileLayout } from "@app/classes/graphql/user/profileLayout"
import { IsEmail, IsHexColor, Matches, MaxLength, MinLength } from "class-validator"
import { ThemeEngine } from "@app/classes/graphql/user/themeEngine"
import { DangerZoneInput } from "@app/classes/graphql/chat/deleteChat"
import { GraphQLJSON } from "graphql-scalars"
import { FriendRequestPrivacy, GroupPrivacy } from "@app/classes/graphql/user/privacy"
import { UserStoredStatus } from "@app/classes/graphql/user/status"

@InputType()
export class UpdateUserInput {
  @MinLength(2)
  @MaxLength(32)
  @Field({
    nullable: true
  })
  username: string
  @IsEmail()
  @Field({
    nullable: true
  })
  email: string
  @Field({
    nullable: true
  })
  discordPrecache: boolean
  @Field({
    nullable: true
  })
  darkTheme: boolean
  @Field({
    nullable: true
  })
  description: string
  @Field({
    nullable: true
  })
  itemsPerPage: number
  @Field({
    nullable: true
  })
  storedStatus: "online" | "idle" | "busy" | "invisible"
  @Field({
    nullable: true
  })
  weatherUnit: "celsius" | "fahrenheit" | "kelvin"
  @Field(() => GraphQLJSON, {
    nullable: true
  })
  themeEngine: ThemeEngine
  @Field({
    nullable: true
  })
  insights: "everyone" | "friends" | "nobody"
  @Field(() => GraphQLJSON, {
    nullable: true
  })
  profileLayout: ProfileLayout
  @Field({
    nullable: true
  })
  language: string
  @Field(() => [Number], {
    nullable: true
  })
  excludedCollections: number[]
  @Field({
    nullable: true
  })
  publicProfile: boolean
  @Field({
    nullable: true
  })
  privacyPolicyAccepted: boolean
  @IsHexColor()
  @Field({
    nullable: true
  })
  nameColor: string
  @Field(() => GroupPrivacy, {
    nullable: true
  })
  groupPrivacy: GroupPrivacy
  @Field({
    nullable: true
  })
  pulse: boolean
  @Field(() => FriendRequestPrivacy, {
    nullable: true
  })
  friendRequests: FriendRequestPrivacy
}

@InputType()
export class ChangePasswordInput {
  @Field({
    nullable: true
  })
  totp?: string
  @Field()
  currentPassword: string
  @Field()
  @MinLength(8)
  newPassword: string
}

@InputType()
export class ChangeUsernameInput extends DangerZoneInput {
  @Field()
  @MaxLength(32)
  @Matches(/^[A-Za-z0-9.\-_]+$/, {
    message: "Username can only contain alphanumeric characters including .-_"
  })
  @MinLength(2)
  username: string
}

@InputType()
export class ChangeEmailInput extends DangerZoneInput {
  @Field()
  @IsEmail()
  email: string
}

@InputType()
export class UpdateUserStatusInput {
  @Field(() => UserStoredStatus)
  storedStatus: UserStoredStatus
}
