import { Resolver } from "type-graphql"
import { Service } from "typedi"
import { Upload } from "@app/models/upload.model"

@Resolver(Upload)
@Service()
export class UploadResolver {}
