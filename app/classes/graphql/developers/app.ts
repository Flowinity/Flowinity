import { Field, InputType } from "type-graphql"

@InputType()
export class MyAppInput {
  @Field()
  id: string
}
