import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class SubscriptionMetadata {
  @Field()
  hours: number
}
