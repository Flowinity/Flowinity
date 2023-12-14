import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType
} from "type-graphql"
import { Upload } from "@app/models/upload.model"
import { Message } from "@app/models/message.model"

export enum EmbedMediaType {
  IMAGE,
  VIDEO,
  AUDIO,
  FILE
}

registerEnumType(EmbedMediaType, {
  name: "EmbedMediaType"
})

export enum EmbedVersion {
  COLUBRINA,
  V1,
  V2
}

registerEnumType(EmbedVersion, {
  name: "EmbedVersion"
})

@InputType("EmbedMediaInput")
export class EmbedMediaInput {
  @Field({
    nullable: true
  })
  url?: string
  @Field({
    nullable: true
  })
  proxyUrl?: string
  @Field({
    nullable: true
  })
  attachment?: string
}

@ObjectType("EmbedMedia")
export class EmbedMedia {
  @Field({
    nullable: true
  })
  url?: string
  @Field({
    nullable: true
  })
  proxyUrl?: string
  @Field({
    nullable: true
  })
  attachment?: string
  @Field({
    nullable: true
  })
  width?: number
  @Field({
    nullable: true
  })
  height?: number
  @Field()
  isInternal: boolean
  @Field(() => Upload, {
    nullable: true
  })
  upload?: Upload
  @Field({
    nullable: true
  })
  mimeType?: string
  @Field(() => EmbedMediaType)
  type: EmbedMediaType
  @Field({
    nullable: true,
    description: "Used for trusted video embed sources, such as YouTube."
  })
  videoEmbedUrl?: string
}

@InputType()
export class EmbedTextInput {
  @Field()
  text: string
  @Field({
    nullable: true
  })
  heading?: boolean
  @Field({
    nullable: true
  })
  imageUrl?: string
}

@ObjectType()
export class EmbedText {
  @Field({
    nullable: true
  })
  imageProxyUrl?: string
  @Field()
  text: string
  @Field({
    nullable: true
  })
  heading?: boolean
  @Field({
    nullable: true
  })
  imageUrl?: string
}

export enum EmbedType {
  REGULAR,
  CHAT_INVITE,
  DIRECT
}

registerEnumType(EmbedType, {
  name: "EmbedType"
})

@ObjectType()
@InputType("EmbedMetadataInput")
export class EmbedMetadata {
  @Field({
    nullable: true
  })
  url?: string
  @Field({
    nullable: true
  })
  siteName?: string
  @Field({
    nullable: true
  })
  siteIcon?: string
  @Field({
    nullable: true
  })
  footer?: string
  @Field({
    defaultValue: EmbedType.REGULAR
  })
  type: EmbedType = EmbedType.REGULAR
  @Field({
    nullable: true,
    description: "Used for chat invites, and other embeds."
  })
  id?: string
  @Field({
    nullable: true,
    description: "Used for NSFW embeds and content."
  })
  restricted: boolean = false
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
  @Field(() => EmbedVersion, {
    defaultValue: EmbedVersion.V2
  })
  version = EmbedVersion.V2
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
  @Field(() => EmbedVersion, {
    defaultValue: EmbedVersion.V2
  })
  version = EmbedVersion.V2
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
