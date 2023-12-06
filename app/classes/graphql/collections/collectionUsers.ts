import { Field, InputType, Int } from "type-graphql"
import { DangerZoneInput } from "@app/classes/graphql/chat/deleteChat"

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

@InputType()
export class TransferCollectionOwnershipInput extends DangerZoneInput {
  @Field(() => Int)
  userId: number
  @Field(() => Int)
  collectionId: number
}
