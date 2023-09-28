import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class Platform {
  @Field()
  platform: string
  @Field()
  id: string
  @Field()
  lastSeen: String
  @Field()
  status: string
}
