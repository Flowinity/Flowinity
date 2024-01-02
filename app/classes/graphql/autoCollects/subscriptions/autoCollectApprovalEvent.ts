import { Field, ObjectType, registerEnumType } from "type-graphql"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"

export enum AutoCollectApprovalType {
  NEW = "new",
  APPROVED = "approve",
  DENIED = "deny"
}

registerEnumType(AutoCollectApprovalType, {
  name: "AutoCollectApprovalType"
})

@ObjectType()
export class AutoCollectApprovalEvent {
  @Field(() => AutoCollectApprovalType)
  type: AutoCollectApprovalType

  @Field(() => AutoCollectApproval)
  autoCollectApproval: AutoCollectApproval
}
