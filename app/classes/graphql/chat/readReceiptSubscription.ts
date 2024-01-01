import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
export class ReadReceipt {
  @Field(() => Int)
  chatId: number
  @Field(() => Int)
  associationId: number
  @Field(() => Int)
  messageId: number
  @Field(() => PartialUserBase)
  user: PartialUserBase
}
