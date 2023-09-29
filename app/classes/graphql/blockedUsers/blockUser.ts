import { Field, InputType, Int } from "type-graphql"

@InputType()
export class BlockUserInput {
  @Field(() => Int)
  userId: number
  @Field()
  silent: boolean
}
