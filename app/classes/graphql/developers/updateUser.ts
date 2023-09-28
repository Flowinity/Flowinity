import { Field, InputType } from "type-graphql"

@InputType()
export class UpdateAppUserInput {
  @Field()
  id: string
  @Field()
  oauthAppId: string
  @Field()
  manage: boolean
}

@InputType()
export class AddAppUserInput {
  @Field()
  username: string
  @Field()
  oauthAppId: string
  @Field({
    nullable: true
  })
  manage: boolean
}
