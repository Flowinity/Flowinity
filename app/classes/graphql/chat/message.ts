import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  registerEnumType
} from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { IsNumber, Max, Min, ValidateNested } from "class-validator"
import { Upload } from "@app/models/upload.model"
import { Type } from "class-transformer"

export enum MessageType {
  MESSAGE = "message",
  LEAVE = "leave",
  JOIN = "join",
  PIN = "pin",
  ADMINISTRATOR = "administrator",
  RENAME = "rename",
  SYSTEM = "system"
}

registerEnumType(MessageType, {
  name: "MessageType",
  description:
    "The type of message. Can be null for legacy (Colubrina) messages where `MESSAGE` should be inferred."
})

export enum ScrollPosition {
  TOP = "top",
  BOTTOM = "bottom"
}

registerEnumType(ScrollPosition, {
  name: "ScrollPosition",
  description: "The position to retrieve messages from based on the `offset`."
})

@ObjectType()
export class EmbedData {
  @Field({
    nullable: true
  })
  url: string
  @Field({
    nullable: true
  })
  title: string
  @Field({
    nullable: true
  })
  description: string
  @Field({
    nullable: true
  })
  siteName: string
  @Field({
    nullable: true
  })
  width: number
  @Field({
    nullable: true
  })
  height: number
  @Field(() => Upload, {
    nullable: true
  })
  upload: Upload
  @Field({
    nullable: true
  })
  type: string
}

@ObjectType()
export class Embed {
  @Field()
  type: string
  @Field({
    nullable: true
  })
  data: EmbedData
}

@InputType()
export class MessagesSearch {
  @Field(() => String, {
    nullable: true
  })
  query: string
  @Field(() => Number, {
    nullable: true
  })
  userId: number
  @Field(() => DateType, {
    nullable: true
  })
  before: Date
  @Field(() => DateType, {
    nullable: true
  })
  after: Date
}

@InputType()
export class MessagesInput {
  @Field(() => Number)
  associationId: number
  @Field(() => Number, {
    defaultValue: 50
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number
  @Field(() => Number, {
    nullable: true
  })
  offset: number
  @Field(() => ScrollPosition, {
    nullable: true
  })
  position: ScrollPosition
  @Field(() => MessagesSearch, {
    nullable: true
  })
  search: MessagesSearch
}
