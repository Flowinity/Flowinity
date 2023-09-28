import { Field, InputType, ObjectType } from "type-graphql"

@ObjectType()
export class ListResponse {
  @Field()
  path: string
  @Field()
  name: string
  @Field()
  delimiter: string
  @Field(() => [String])
  flags: Set<string>
  @Field({
    nullable: true
  })
  specialUse: string
  @Field()
  listed: boolean
  @Field({
    nullable: true
  })
  subscribed: boolean
}

@InputType()
export class GetMailInput {
  @Field()
  userId: number
  @Field()
  mailbox: string
  @Field({
    nullable: true
  })
  page: number
}
