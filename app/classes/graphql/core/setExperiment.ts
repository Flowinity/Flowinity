import { Field, InputType, Int } from "type-graphql"

@InputType()
export class SetExperimentInput {
  @Field(() => String)
  key: string
  @Field(() => Int)
  value: number
  @Field(() => Int, {
    nullable: true,
    description: "Admin only."
  })
  userId: number
}
