import { Field, InputType } from "type-graphql"

@InputType()
export class UserProfileInput {
  @Field({
    nullable: true
  })
  id?: number
  @Field({
    nullable: true
  })
  username?: string
}
