import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType
} from "type-graphql"
import { GraphQLJSON } from "graphql-scalars"
import { BlockAPI } from "@editorjs/editorjs/types/api/block"

export enum UpdateNoteEventType {
  INSERT = "insert",
  UPDATE = "update",
  DELETE = "delete"
}

registerEnumType(UpdateNoteEventType, {
  name: "UpdateNoteEventType"
})

export enum CollabEventType {
  JOIN = "join",
  LEAVE = "leave"
}

registerEnumType(CollabEventType, {
  name: "CollabEventType"
})

@InputType("WorkspaceNoteInput")
@ObjectType()
export class WorkspaceNote {
  @Field({
    nullable: true
  })
  version: string
  @Field(() => GraphQLJSON, {
    nullable: true
  })
  blocks: BlockAPI[]
  @Field(() => Float, {
    nullable: true
  })
  time: bigint
}

@ObjectType()
export class WorkspaceNoteMetadata {
  @Field({
    nullable: true
  })
  version: string
}

@ObjectType()
export class NotePermissionsMetadata {
  @Field()
  modify: boolean
  @Field()
  read: boolean
  @Field()
  configure: boolean
}

@InputType("UpdateNoteEventInput")
export class UpdateNoteEventInput {
  @Field(() => UpdateNoteEventType)
  type: UpdateNoteEventType
  @Field(() => GraphQLJSON, {
    nullable: true
  })
  data: any
  @Field(() => String, {
    nullable: true
  })
  blockId?: string
  @Field(() => Int)
  id: number
}

@ObjectType()
export class UpdateNoteEvent {
  @Field(() => UpdateNoteEventType)
  type: UpdateNoteEventType
  @Field(() => GraphQLJSON, {
    nullable: true
  })
  data: any
  @Field(() => String, {
    nullable: true
  })
  blockId?: string
  @Field(() => Int)
  id: number
  @Field(() => Int)
  userId: number
  @Field(() => String, {
    nullable: true
  })
  shareLink: string | null
}

@InputType("NoteCollabPositionInput")
export class NoteCollabPositionInput {
  @Field(() => Int)
  blockIndex: number
  @Field(() => Int)
  position: number
  @Field(() => Int)
  noteId: number
}

@ObjectType()
export class NoteCollabPosition {
  @Field(() => Int)
  blockIndex: number
  @Field(() => Int)
  position: number
  @Field(() => Int)
  userId: number
  @Field(() => Int)
  noteId: number
  @Field(() => String, {
    nullable: true
  })
  shareLink: string | null
  @Field(() => CollabEventType)
  type: CollabEventType
}
