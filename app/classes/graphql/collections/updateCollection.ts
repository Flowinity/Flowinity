import { Field, InputType, Int } from "type-graphql"
import { MaxLength, MinLength } from "class-validator"

@InputType()
export class UpdateCollectionInput {
  @Field(() => Int)
  collectionId: number
  @Field(() => String, {
    nullable: true
  })
  @MaxLength(64)
  @MinLength(3)
  name?: string
  @Field(() => Boolean, {
    nullable: true
  })
  shareLink?: boolean
}
