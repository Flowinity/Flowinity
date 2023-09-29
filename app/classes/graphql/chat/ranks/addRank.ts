import { Field, InputType, Int } from "type-graphql"

@InputType()
export class AddRank {
  @Field(() => Int)
  chatAssociationId: number

  @Field(() => Int)
  updatingChatAssociationId: number

  @Field(() => String)
  rankId: string
}
