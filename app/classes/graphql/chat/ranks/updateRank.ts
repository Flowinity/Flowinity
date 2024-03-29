import { Field, InputType, Int } from "type-graphql"
import { IsHexColor, IsOptional, MaxLength, MinLength } from "class-validator"

@InputType()
export class UpdateRank {
  @Field(() => Int)
  associationId: number
  @Field()
  rankId: string
  @Field(() => [String])
  permissionsMap: string[]
  @Field(() => String, {
    nullable: true
  })
  @MaxLength(24)
  @MinLength(1)
  @IsOptional()
  name?: string
  @Field(() => String, {
    nullable: true
  })
  @IsHexColor()
  @IsOptional()
  color?: string
}

@InputType()
export class CreateRank {
  @Field(() => Int)
  associationId: number
  @Field(() => String, {
    nullable: true
  })
  @MaxLength(24)
  @MinLength(1)
  name: string
  @Field(() => String, {
    nullable: true
  })
  @IsHexColor()
  @IsOptional()
  color?: string
}

@InputType()
export class UpdateRankOrder {
  @Field(() => Int)
  associationId: number
  @Field(() => [String], {
    description:
      "Order if the rank, this is actually reversed from expected index value, so rankIds[0] is the highest priority rank."
  })
  rankIds: string[]
}

@InputType()
export class DeleteRank {
  @Field(() => Int)
  associationId: number
  @Field(() => String)
  rankId: string
}
