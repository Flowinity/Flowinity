import { Field, InputType } from "type-graphql"

@InputType()
export class InviteInput {
  @Field(() => String)
  inviteId: string
}
