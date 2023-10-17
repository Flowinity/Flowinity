import { Field, InputType } from "type-graphql"
import { ArrayMaxSize, ArrayMinSize } from "class-validator"

@InputType()
export class DeleteUploadInput {
  @Field(() => [Number])
  @ArrayMaxSize(24)
  @ArrayMinSize(1)
  items: number[]
}
