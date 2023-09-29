import { Field, InputType, Int } from "type-graphql"
import { IsNumber, IsOptional, Min } from "class-validator"

@InputType()
export class CreateInviteInput {
  @Field(() => Int, {
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

  @Field(() => Int)
  associationId: number
}

@InputType()
export class InvalidateInviteInput {
  @Field(() => Int)
  associationId: number
  @Field(() => String)
  inviteId: string
}
