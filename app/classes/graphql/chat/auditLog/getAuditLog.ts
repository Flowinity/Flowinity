import { Field, InputType } from "type-graphql"
import { IsNumber, IsOptional, Max, Min } from "class-validator"

@InputType()
export class AuditLogInput {
  @Field()
  associationId: number
  @Field({
    defaultValue: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1
  @Field({
    defaultValue: 24
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(250)
  limit: number = 24
}
