import { FieldResolver, Resolver, Root } from "type-graphql"
import { Service } from "typedi"
import { Upload } from "@app/models/upload.model"

@Resolver(Upload)
@Service()
export class UploadResolver {
  @FieldResolver()
  mimeType(@Root() upload: Upload): string {
    return upload.mimeType || "application/octet-stream"
  }
}
