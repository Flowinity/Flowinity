import { Field, InputType, Int, ObjectType } from "type-graphql"
import { Upload } from "@app/models/upload.model"
import { Message } from "@app/models/message.model"

@InputType("EmbedMediaInput")
export class EmbedMediaInput {
  @Field({
    nullable: true
  })
  url: string
  @Field({
    nullable: true
  })
  proxyUrl: string
  @Field({
    nullable: true
  })
  attachment: string
}

@ObjectType()
export class EmbedMedia extends EmbedMediaInput {
  @Field()
  width: number
  @Field()
  height: number
  @Field()
  isInternal: boolean
  @Field(() => Upload, {
    nullable: true
  })
  upload: Upload
}

@InputType()
export class EmbedTextInput {
  @Field()
  text: string
  @Field()
  heading: boolean
  @Field({
    nullable: true
  })
  imageUrl: string
}

@ObjectType()
export class EmbedText extends EmbedTextInput {
  @Field()
  imageProxyUrl: string
}

@ObjectType()
@InputType("EmbedMetadataInput")
export class EmbedMetadata {
  @Field()
  url: string
  @Field()
  siteName: string
  @Field()
  siteIcon: string
}

@ObjectType()
export class EmbedDataV2 {
  @Field(() => [EmbedMedia], {
    nullable: true
  })
  media: EmbedMedia[]
  @Field(() => [EmbedText], {
    nullable: true
  })
  text: EmbedText[]
  @Field(() => EmbedMetadata)
  metadata: EmbedMetadata
}

@InputType()
export class EmbedDataV2Input {
  @Field(() => [EmbedMediaInput], {
    nullable: true
  })
  media: EmbedMediaInput[]
  @Field(() => [EmbedTextInput], {
    nullable: true
  })
  text: EmbedTextInput[]
  @Field(() => EmbedMetadata, {
    nullable: true
  })
  metadata: EmbedMetadata
}

@ObjectType()
export class EmbedResolutionEvent {
  @Field(() => Int)
  associationId: number

  @Field(() => Message)
  message: Message
}

@InputType()
export class EmbedResolutionFilter {
  @Field(() => Int, {
    nullable: true
  })
  associationId: number
  @Field(() => Int, {
    nullable: true
  })
  messageId: number
}

@InputType()
export class EmbedPrecacheInput {
  @Field({
    nullable: true
  })
  url: string
  @Field({
    nullable: true
  })
  attachment: string
}
