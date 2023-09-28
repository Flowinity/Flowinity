import { Field, InputType } from "type-graphql"

@InputType()
export class AddRank {
  @Field(() => Number)
  chatAssociationId: number

  @Field(() => Number)
  updatingChatAssociationId: number

  @Field(() => String)
  rankId: string
}
