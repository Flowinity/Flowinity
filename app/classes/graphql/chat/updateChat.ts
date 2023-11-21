import { Field, InputType, Int } from "type-graphql"
import { IsOptional, IsString, MaxLength } from "class-validator"

@InputType()
export class UpdateChatInput {
  @Field(() => String, {
    nullable: true
  })
  @IsString()
  @MaxLength(50)
  name?: string
  @Field(() => Int)
  associationId: number
  @Field(() => String, {
    nullable: true,
    description:
      "Can only be null or undefined to unset or do not modify the group icon respectively. Use the REST API to set one."
  })
  @IsOptional()
  icon?: string | null
  @Field(() => String, {
    nullable: true,
    description:
      "Can only be null or undefined to unset or do not modify the group background respectively. Use the REST API to set one."
  })
  background?: string | null
  @Field(() => String, {
    nullable: true
  })
  @IsString()
  @MaxLength(200)
  description?: string
}
