import { Field, InputType, Int } from "type-graphql"

@InputType()
export class DeleteEmojiInput {
  @Field()
  id: string
  @Field(() => Int)
  associationId: number
}
