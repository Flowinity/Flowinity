import { Field, Float, ObjectType } from "type-graphql"

@ObjectType()
export class SubscriptionMetadata {
  @Field(() => Float)
  hours: number
}
