import { Field, InputType, ObjectType } from "type-graphql"
import { IsOptional, IsUrl, MaxLength, MinLength } from "class-validator"

@InputType()
export class MyAppInput {
  @Field()
  id: string
}

@InputType()
export class AuthorizeAppInput {
  @Field()
  id: string
  @Field()
  scopes: string
  @Field(() => [String], {
    nullable: true,
    description: "Used for bots."
  })
  permissions?: string[]
}

@ObjectType()
export class AuthorizeAppResponse {
  @Field(() => String, {
    nullable: true
  })
  token: string | null
}

@InputType()
export class CreateBotInput extends MyAppInput {
  @Field()
  @MinLength(2)
  @MaxLength(32)
  username: string
}

@InputType()
export class CreateAppInput {
  @Field()
  @MinLength(2)
  @MaxLength(32)
  name: string
  @Field({
    nullable: true
  })
  @MaxLength(200)
  description: string
  @Field({
    nullable: true
  })
  @IsUrl()
  @IsOptional()
  redirectUri: string
  @Field()
  private: boolean
  @Field()
  verified: boolean
}

@InputType()
export class UpdateAppInput extends CreateAppInput {
  @Field()
  id: string
}

@ObjectType()
export class OauthAppSecret {
  @Field()
  secret: string
}
