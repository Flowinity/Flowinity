import { Field, InputType } from "type-graphql"

@InputType()
export class CreateEmojiInput {
  @Field(() => Number)
  associationId: number
}
