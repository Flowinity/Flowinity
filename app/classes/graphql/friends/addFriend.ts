import { Field, InputType, Int, registerEnumType } from "type-graphql"

export enum FriendAction {
  SEND = "send",
  REMOVE = "remove",
  ACCEPT = "accept"
}

registerEnumType(FriendAction, {
  name: "FriendAction"
})

@InputType()
export class AddFriendInput {
  @Field(() => Int, {
    nullable: true,
    description: "Can use `userId` or `username`"
  })
  userId: number
  @Field(() => String, {
    nullable: true,
    description: "Can use `userId` or `username`"
  })
  username: string
  @Field(() => FriendAction, {
    nullable: true,
    description: "If null, it works as a toggle. This is for explicit actions."
  })
  action: FriendAction
}
