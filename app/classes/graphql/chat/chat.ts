import { Field, InputType } from "type-graphql"

@InputType()
export class ChatInput {
  @Field(() => Number, {
    nullable: true
  })
  associationId?: number

  @Field(() => Number, {
    nullable: true
  })
  chatId?: number
}
