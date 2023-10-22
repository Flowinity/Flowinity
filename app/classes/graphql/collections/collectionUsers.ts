import { Field, InputType, Int } from "type-graphql"

@InputType()
export class UpdateCollectionUserPermissionsInput {
  @Field(() => Int)
  userId: number
  @Field(() => Int)
  collectionId: number
  @Field()
  read: boolean
  @Field()
  write: boolean
  @Field()
  configure: boolean
}

@InputType()
export class RemoveCollectionUserInput {
  @Field(() => Int)
  userId: number
  @Field(() => Int)
  collectionId: number
}
