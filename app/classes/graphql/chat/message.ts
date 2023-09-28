import { Field, InputType, ObjectType, registerEnumType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { IsNumber, Max, Min } from "class-validator"
import { Upload } from "@app/models/upload.model"
import { GraphQLJSON } from "graphql-scalars"
import { SeriesGraph } from "@app/models/insight.model"
import { DataLabelsGraph } from "@app/classes/graphql/core/core"

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

@InputType("InteractiveGraphInput")
@ObjectType()
export class InteractiveGraph extends DataLabelsGraph {
  @Field()
  type: "line" | "bar" | "scatter"
}

@InputType()
export class EmbedInput extends EmbedData {
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
  type: string
  @Field({
    nullable: true
  })
  image: string
  @Field({
    nullable: true
  })
  color: string
  @Field({
    nullable: true
  })
  graph: InteractiveGraph
}

@ObjectType()
export class Embed {
  @Field()
  type: string
  @Field(() => GraphQLJSON, {
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
  @Field(() => Boolean, {
    nullable: true
  })
  pins?: boolean
}

@InputType()
export class MessagesInput {
  @Field(() => Number)
  associationId: number
  @Field(() => ScrollPosition, {
    nullable: true
  })
  position: ScrollPosition
  @Field(() => MessagesSearch, {
    nullable: true
  })
  search: MessagesSearch
  @Field(() => Number, {
    defaultValue: 50
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number
}

@InputType()
export class PagedMessagesInput extends MessagesInput {
  @Field(() => Number, {
    defaultValue: 1
  })
  @IsNumber()
  @Min(1)
  page: number
}

@InputType()
export class InfiniteMessagesInput extends MessagesInput {
  @Field(() => Number, {
    nullable: true
  })
  offset: number
}
