import { Field, InputType, Int } from "type-graphql"
import { MaxLength, MinLength } from "class-validator"

@InputType()
export class UpdateEmojiInput {
  @Field()
  id: string
  @MaxLength(24)
  @MinLength(3)
  @Field()
  name: string
  @Field(() => Int)
  associationId: number
}
