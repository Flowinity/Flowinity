import { Field, InputType, Int } from "type-graphql"

@InputType()
export class CreateEmojiInput {
  @Field(() => Int)
  associationId: number
}
