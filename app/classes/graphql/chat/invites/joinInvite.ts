import { Field, InputType } from "type-graphql"

@InputType()
export class JoinChatFromInviteInput {
  @Field(() => String)
  inviteId: string
}
