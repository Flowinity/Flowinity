import { Field, InputType } from "type-graphql"

@InputType()
export class CreateChatInput {
  @Field(() => [Number])
  users: number[]

  @Field(() => String, {
    nullable: true
  })
  name?: string
}
