import { Field, InputType } from "type-graphql"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"

@InputType()
export class AddBotToChatInput {
  @Field()
  associationId: number
  @Field()
  botAppId: string
  @Field(() => [String])
  permissions: ChatPermissions[]
}
