import { Field, InputType } from "type-graphql"
import { MaxLength, MinLength } from "class-validator"

@InputType()
export class SendMessageInput {
  @Field(() => String)
  @MinLength(1)
  @MaxLength(4000)
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
