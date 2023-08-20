import { Field, InputType, ObjectType } from "type-graphql"
import { ProfileLayout } from "@app/classes/graphql/user/profileLayout"
import { IsEmail, IsHexColor, MaxLength, MinLength } from "class-validator"
import { ThemeEngine } from "@app/classes/graphql/user/themeEngine"

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
  @Field(() => ThemeEngine, {
    nullable: true
  })
  themeEngine: ThemeEngine
  @Field({
    nullable: true
  })
  insights: "everyone" | "friends" | "nobody"
  @Field(() => ProfileLayout, {
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
}
