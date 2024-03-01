import { Field, InputType, Int, ObjectType } from "type-graphql"
import { AlternatePassword } from "@app/classes/graphql/user/alternatePassword"
import { LoginUser } from "@app/classes/graphql/auth/login"

@InputType("AuthValidationCredentialsInput")
@ObjectType()
export class AuthValidationCredentials {
  @Field({
    nullable: true
  })
  password?: string
  @Field({
    nullable: true
  })
  totp?: string
}

@InputType("AuthValidationRequirementsInput")
@ObjectType()
export class AuthValidationRequirements {
  @Field()
  password: boolean
  @Field()
  alternatePassword: boolean
  @Field()
  totp: boolean
  @Field(() => AuthValidationCredentials)
  credentials: AuthValidationCredentials
  @Field(() => Int, {
    nullable: true
  })
  userId?: number
  @Field(() => String, {
    nullable: true
  })
  username?: string
  @Field(() => Boolean, {
    nullable: true
  })
  allowBanned?: boolean
}

@ObjectType()
export class AuthValidationResponse {
  @Field(() => AlternatePassword, {
    nullable: true
  })
  alternatePassword: AlternatePassword | null
  @Field()
  success: boolean
  @Field(() => LoginUser)
  user: LoginUser
}
