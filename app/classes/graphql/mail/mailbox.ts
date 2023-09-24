import { Field, ObjectType } from "type-graphql"

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
