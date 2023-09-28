import { Field, InputType } from "type-graphql"

@InputType()
export class SetExperimentInput {
  @Field(() => String)
  key: string
  @Field(() => Number)
  value: number
  @Field(() => Number, {
    nullable: true,
    description: "Admin only."
  })
  userId: number
}
