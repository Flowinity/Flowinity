import { Field, InputType } from "type-graphql"
import { IsString, MaxLength } from "class-validator"

@InputType()
export class UpdateChatInput {
  @Field(() => String, {
    nullable: true
  })
  @IsString()
  @MaxLength(50)
  name?: string | null
  @Field(() => Number)
  associationId: number
}
