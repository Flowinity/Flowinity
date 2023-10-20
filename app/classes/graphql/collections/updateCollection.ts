import { Field, InputType, Int } from "type-graphql"
import { MaxLength, MinLength } from "class-validator"

@InputType()
export class UpdateCollectionInput {
  @Field(() => Int)
  collectionId: number
  @Field(() => String)
  @MaxLength(64)
  @MinLength(3)
  name: string
}
