import { Field, InputType, ObjectType } from "type-graphql"
import { Star } from "@app/models/star.model"

@InputType()
export class StarUploadInput {
  @Field({
    description:
      "The upload's attachment ID, not numerical ID, such as 1d7fe21g3jd1.png"
  })
  attachment: string
}

@ObjectType()
export class StarUploadResponse {
  @Field()
  status: boolean
  @Field(() => Star, {
    nullable: true
  })
  star: Star | null
}
