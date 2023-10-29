import { Field, InputType } from "type-graphql"
import { SessionType } from "@app/classes/graphql/user/sessions"

@InputType()
export class SessionInput {
  @Field(() => SessionType)
  type: SessionType
}
