import { Field, InputType, Int, registerEnumType } from "type-graphql"

export enum ActOnAutoCollectAction {
  APPROVE = "approve",
  REJECT = "reject"
}

registerEnumType(ActOnAutoCollectAction, {
  name: "AutoCollectAction"
})

@InputType()
export class ActOnAutoCollectsInput {
  @Field(() => [Int])
  items: number[]
  @Field(() => ActOnAutoCollectAction)
  action: ActOnAutoCollectAction
}
