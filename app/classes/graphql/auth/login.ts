import { Field, InputType, ObjectType } from "type-graphql"
import { IsEmail, Matches, MaxLength, MinLength } from "class-validator"
import { BanReason } from "@app/classes/graphql/user/ban"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
export class LoginUser {
  @Field()
  id: number

  @Field()
  username: string

  @Field()
  email: string

  @Field()
  banned: boolean
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string

  @Field()
  user: LoginUser

  @Field(() => BanResponse, {
    nullable: true
  })
  ban: BanResponse | null
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

@ObjectType()
export class BanResponse {
  @Field(() => String, {
    nullable: true
  })
  message: string | null
  @Field()
  type: BanReason
  @Field(() => DateType, {
    nullable: true
  })
  pendingDeletionDate: Date | null
}
