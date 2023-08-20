import { Field, GraphQLISODateTime, ObjectType } from "type-graphql"
import { DateTimeResolver } from "graphql-scalars"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
export class PartialUserBase {
  @Field()
  username: string
  @Field()
  id: number
  @Field(() => DateType)
  createdAt: Date
  @Field()
  administrator: boolean
  @Field()
  moderator: boolean
  @Field({
    nullable: true
  })
  avatar: string
}

export const partialUserBase = [
  "username",
  "id",
  "createdAt",
  "administrator",
  "moderator",
  "avatar"
]
