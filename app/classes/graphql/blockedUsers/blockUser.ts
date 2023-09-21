import { Field, InputType } from "type-graphql"

@InputType()
export class BlockUserInput {
  @Field(() => Number)
  userId: number
  @Field()
  silent: boolean
}
