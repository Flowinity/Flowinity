import { Field, InputType, Int } from "type-graphql"

@InputType()
export class FilterCollectionInput {
  @Field(() => Int, {
    nullable: true
  })
  collectionId: number
}
