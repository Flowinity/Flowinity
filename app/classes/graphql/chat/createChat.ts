import { Field, InputType, registerEnumType } from "type-graphql"

export enum ChatType {
  GROUP = "group",
  DIRECT = "direct"
}

registerEnumType(ChatType, {
  name: "ChatType"
})

@InputType()
export class CreateChatInput {
  @Field(() => [Number])
  users: number[]

  @Field(() => String, {
    nullable: true
  })
  name?: string

  @Field(() => ChatType, {
    nullable: true
  })
  type?: ChatType
}
