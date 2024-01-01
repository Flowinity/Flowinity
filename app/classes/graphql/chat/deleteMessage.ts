import { Field, Int, ObjectType } from "type-graphql"

@ObjectType()
export class DeleteMessage {
  @Field(() => Int)
  id: number
  @Field(() => Int)
  associationId: number
  @Field(() => Int)
  chatId: number
}
