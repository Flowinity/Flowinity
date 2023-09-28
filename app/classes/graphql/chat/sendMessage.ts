import { Field, InputType } from "type-graphql"
import { ArrayMaxSize, IsOptional, MaxLength, MinLength } from "class-validator"
import { Embed, EmbedInput } from "@app/classes/graphql/chat/message"

@InputType()
export class SendMessageInput {
  @Field(() => String)
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
  @Field(() => [EmbedInput], {
    nullable: true
  })
  @ArrayMaxSize(3)
  @IsOptional()
  embeds?: EmbedInput[]
}
