import { Field, Int, ObjectType } from "type-graphql"
import { UserStatus } from "@app/classes/graphql/user/status"
import { Platform } from "@app/classes/graphql/user/platforms"

@ObjectType()
export class StatusEvent {
  @Field(() => Int)
  id: number
  @Field(() => UserStatus)
  status: UserStatus
  @Field(() => [Platform])
  platforms: Platform[]
}
