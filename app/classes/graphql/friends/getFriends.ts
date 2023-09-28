import { Field, InputType } from "type-graphql"
import { FriendStatus } from "@app/classes/graphql/user/friends"

@InputType()
export class FriendsInput {
  @Field(() => FriendStatus, {
    nullable: true
  })
  status: FriendStatus
}
