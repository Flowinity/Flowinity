import { Field, InputType, Int } from "type-graphql"

@InputType({
  description: "Used for dangerous operations."
})
export class DangerZoneInput {
  @Field(() => String, {
    nullable: true,
    description: "You may use either 2FA token or password to delete the chat."
  })
  password?: string

  @Field({
    nullable: true,
    description:
      "TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat."
  })
  totp?: string
}

@InputType({
  description: "Used for deleting chats and transferring ownership."
})
export class DangerZoneChatInput extends DangerZoneInput {
  @Field(() => Int)
  associationId: number
}

@InputType()
export class TransferOwnershipInput extends DangerZoneChatInput {
  @Field(() => Int, {
    description: "User to transfer to."
  })
  userId: number
}

@InputType()
export class LeaveChatInput {
  @Field(() => Int)
  associationId: number
}
