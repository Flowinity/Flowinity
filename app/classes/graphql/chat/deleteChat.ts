import { Field, InputType } from "type-graphql"

@InputType({
  description: "Used for deleting chats and transferring ownership."
})
export class DangerZoneChatInput {
  @Field(() => Number)
  associationId: number

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

@InputType()
export class LeaveChatInput {
  @Field(() => Number)
  associationId: number
}
