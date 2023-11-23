import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType
} from "type-graphql"
import { IsNumber, Min } from "class-validator"

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
  @Field({
    nullable: true
  })
  limit: number
  @IsNumber()
  @Min(1)
  @Field({
    defaultValue: 1
  })
  page: number
  @Field(() => Boolean, {
    defaultValue: false
  })
  onlyInvited: boolean
}

@InputType()
export class CollectionInput {
  @Field(() => Int, {
    nullable: true
  })
  id: number
  @Field({
    nullable: true
  })
  shareLink: string
}
