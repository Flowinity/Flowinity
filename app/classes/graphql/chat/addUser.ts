import { Field, InputType, registerEnumType } from "type-graphql"
import { ArrayMaxSize, ArrayMinSize } from "class-validator"

export enum ToggleUser {
  ADD = "ADD",
  REMOVE = "REMOVE"
}

registerEnumType(ToggleUser, {
  name: "ToggleUser",
  description: "Whether the user should be added, or removed from the group."
})

@InputType()
export class AddChatUser {
  @Field(() => Number)
  chatAssociationId: number
  @Field(() => [Number])
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  users: number[]
  @Field(() => ToggleUser)
  action: ToggleUser
}
