import { Field, InputType, Int } from "type-graphql"

@InputType()
export class WorkspaceUserInput {
  @Field(() => Int)
  workspaceId: number
  @Field(() => Int)
  userId: number
  @Field(() => Boolean)
  read: boolean
  @Field(() => Boolean)
  write: boolean
  @Field(() => Boolean)
  configure: boolean
}
