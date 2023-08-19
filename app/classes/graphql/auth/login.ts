import { Field, InputType, ObjectType } from "type-graphql"
import { MaxLength, MinLength, IsEmail } from "class-validator"
import { User } from "@app/models/user.model"

@ObjectType()
export class LoginUser {
  @Field()
  id: number

  @Field()
  username: string

  @Field()
  email: string
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string

  @Field()
  user: LoginUser
}

@InputType()
export class LoginInput {
  @Field({
    description: "Username or email"
  })
  username: string

  @Field()
  password: string

  @Field({ nullable: true, description: "TOTP/2FA code if enabled." })
  totp?: string
}

@InputType()
export class RegisterInput {
  @MaxLength(32)
  @MinLength(2)
  @Field()
  username: string

  @Field()
  @MinLength(8)
  password: string

  @IsEmail()
  @Field()
  email: string

  @Field({ nullable: true })
  inviteKey?: string
}
