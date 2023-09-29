import { Field, InputType, Int } from "type-graphql"

@InputType()
export class ChatInput {
  @Field(() => Int, {
    nullable: true
  })
  associationId?: number

  @Field(() => Int, {
    nullable: true
  })
  chatId?: number
}

@InputType()
export class ChatsInput {
  @Field(() => Boolean, {
    defaultValue: false
  })
  hidden: boolean
}
