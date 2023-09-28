import { Field, InputType, ObjectType } from "type-graphql"

@InputType("GenericSuccessInput")
@ObjectType("GenericSuccessObject")
export class Success {
  @Field(() => Boolean)
  success: boolean
}
