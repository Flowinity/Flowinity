import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class PartialUserBase {
  @Field()
  username: string
  @Field()
  id: number
  @Field()
  createdAt: string
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
