import { Field, InputType } from "type-graphql"

@InputType()
export class SendMessageInput {
  @Field()
  content: string
  @Field()
  associationId: number
  @Field(() => [String], {
    defaultValue: []
  })
  attachments: string[]
  @Field({
    nullable: true
  })
  replyId?: number
}
