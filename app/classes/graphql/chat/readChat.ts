import { Field, InputType, Int } from "type-graphql"

@InputType()
export class ReadChatInput {
  @Field(() => Int)
  associationId: number
}
