import { Field, InputType, Int } from "type-graphql"
import { ArrayMaxSize, IsOptional, MaxLength } from "class-validator"
import { EmbedInput } from "@app/classes/graphql/chat/message"
import { EmbedDataV2 } from "@app/classes/graphql/chat/embeds"

@InputType()
export class SendMessageInput {
  @Field(() => String)
  @MaxLength(4000)
  content: string
  @Field(() => Int)
  associationId: number
  @Field(() => [String], {
    defaultValue: []
  })
  @ArrayMaxSize(10)
  attachments: string[]
  @Field(() => Int, {
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

@InputType()
export class EditMessageInput {
  @Field(() => String, {
    nullable: true
  })
  @MaxLength(4000)
  content: string
  @Field(() => [String], {
    defaultValue: []
  })
  @ArrayMaxSize(10)
  attachments: string[]
  @Field(() => Int)
  messageId: number
  @Field(() => [EmbedInput], {
    nullable: true
  })
  @ArrayMaxSize(3)
  @IsOptional()
  embeds?: EmbedDataV2[]
  @Field(() => Int)
  associationId: number
  @Field(() => Boolean, {
    nullable: true
  })
  @IsOptional()
  pinned?: boolean
}

@InputType()
export class DeleteMessageInput {
  @Field(() => Int)
  messageId: number
  @Field(() => Int)
  associationId: number
}
