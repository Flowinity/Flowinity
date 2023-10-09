import { Field, InputType, Int } from "type-graphql"
import { MaxLength, MinLength } from "class-validator"

@InputType()
export class DeleteEmojiInput {
  @Field()
  id: string
  @Field(() => Int)
  associationId: number
}
