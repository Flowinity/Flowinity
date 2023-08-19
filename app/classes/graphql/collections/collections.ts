import { Collection } from "@app/models/collection.model"
import { Field, InputType, ObjectType } from "type-graphql"

@ObjectType()
export class PermissionsMetadata {
  @Field()
  write: boolean
  @Field()
  read: boolean
  @Field()
  configure: boolean
}

@ObjectType()
export class CollectionCache extends Collection {
  @Field()
  permissionsMetadata: PermissionsMetadata
  @Field({
    nullable: true
  })
  shared: boolean
}

@InputType()
export class UserCollectionsInput {
  @Field({
    nullable: true
  })
  type: string
  @Field({
    nullable: true
  })
  search: string
}
