import { Field, InputType } from "type-graphql"
import { MaxLength, MinLength } from "class-validator"

@InputType()
export class CreateCollectionInput {
  @Field(() => String)
  @MaxLength(64)
  @MinLength(3)
  name: string
}
