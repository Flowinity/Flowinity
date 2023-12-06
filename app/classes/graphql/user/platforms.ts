import { Field, ObjectType, registerEnumType } from "type-graphql"
import { UserStatus } from "@app/classes/graphql/user/status"

export enum PlatformType {
  DESKTOP = "desktop",
  WEB = "web",
  MOBILE = "mobile"
}

registerEnumType(PlatformType, {
  name: "PlatformType",
  description: "Platform type of user device."
})

@ObjectType()
export class Platform {
  @Field(() => PlatformType)
  platform: PlatformType
  @Field()
  id: string
  @Field()
  lastSeen: string
  @Field(() => UserStatus)
  status: UserStatus
}
