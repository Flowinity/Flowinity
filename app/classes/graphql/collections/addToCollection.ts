import { Field, InputType } from "type-graphql"

@InputType()
export class AddToCollectionInput {
  @Field()
  collectionId: number
  @Field(() => [Number])
  items: number[]
}
