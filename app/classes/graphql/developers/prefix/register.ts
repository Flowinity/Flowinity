import { Field, InputType } from "type-graphql"
import { ArrayMaxSize, MaxLength, MinLength } from "class-validator"

@InputType()
export class RegisterPrefix {
  @Field()
  @MinLength(1)
  @MaxLength(10)
  prefix: string
}

@InputType()
export class RegisterCommand {
  @Field()
  @MinLength(1)
  @MaxLength(64)
  command: string
  @Field()
  @MinLength(1)
  @MaxLength(256)
  description: string
}

@InputType()
export class RegisterCommands {
  @Field(() => [RegisterCommand])
  @ArrayMaxSize(64)
  commands: RegisterCommand[]
}

@InputType()
export class DeregisterCommand {
  @Field()
  @MinLength(1)
  @MaxLength(64)
  command: string
}
