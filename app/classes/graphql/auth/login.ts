import { Field, InputType, ObjectType } from "type-graphql"
import { IsEmail, Matches, MaxLength, MinLength } from "class-validator"

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
  @Matches(/^[A-Za-z0-9.\-_]+$/, {
    message: "Username can only contain alphanumeric characters including .-_"
  })
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
