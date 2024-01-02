import { Field, ObjectType } from "type-graphql"
import { Upload } from "@app/models/upload.model"

@ObjectType()
export class CreateUploadEvent {
  @Field()
  url: string
  @Field(() => Upload)
  upload: Upload
}
