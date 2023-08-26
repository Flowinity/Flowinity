import { Collection } from "@app/models/collection.model"
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql"
import { IsNumber, Max, Min } from "class-validator"

export enum CollectionFilter {
  ALL = "all",
  WRITE = "write",
  READ = "read",
  CONFIGURE = "configure",
  SHARED = "shared",
  OWNED = "owned"
}

registerEnumType(CollectionFilter, {
  name: "CollectionFilter",
  description: "The type of collection"
})

@ObjectType()
export class PermissionsMetadata {
  @Field()
  write: boolean
  @Field()
  read: boolean
  @Field()
  configure: boolean
}

@InputType()
export class UserCollectionsInput {
  @Field(() => [CollectionFilter], {
    defaultValue: [CollectionFilter.ALL]
  })
  filter: CollectionFilter[]
  @Field({
    nullable: true
  })
  search: string
  @IsNumber()
  @Min(1)
  @Max(100)
  @Field({
    defaultValue: 24
  })
  limit: number
  @IsNumber()
  @Field({
    defaultValue: 1
  })
  page: number
}

@InputType()
export class CollectionInput {
  @Field(() => Number, {
    nullable: true
  })
  id: number
  @Field({
    nullable: true
  })
  shareLink: string
}
