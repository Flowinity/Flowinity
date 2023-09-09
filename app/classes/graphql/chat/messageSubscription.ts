import { Message } from "@app/models/message.model"
import { Field, InputType, ObjectType } from "type-graphql"

@ObjectType()
@InputType("MessageSubscriptionInput")
export class MessageSubscription {
  @Field(() => Message, {
    nullable: true
  })
  message: Message | null

  @Field()
  associationId: number

  @Field()
  mention: boolean
}
