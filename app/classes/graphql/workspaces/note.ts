import { Field, Float, InputType, ObjectType } from "type-graphql"
import { Blocks } from "@editorjs/editorjs/types/api"
import { GraphQLJSON } from "graphql-scalars"

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
  blocks: Blocks
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
