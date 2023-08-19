import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class AlternatePassword {
  @Field()
  scopes: string
  @Field()
  totp: boolean
  @Field()
  name: string
}
