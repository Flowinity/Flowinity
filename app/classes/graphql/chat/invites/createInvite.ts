import { Field, InputType } from "type-graphql"
import { IsNumber, IsOptional, Min } from "class-validator"

@InputType()
export class CreateInviteInput {
  @Field(() => Number, {
    nullable: true,
    description: "In hours."
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  expiry: number

  @Field(() => String, {
    nullable: true,
    description: "Auto assign rank on join."
  })
  rankId: string

  @Field(() => Number)
  associationId: number
}
