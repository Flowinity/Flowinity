import { FieldResolver, Resolver, Root } from "type-graphql"
import { CoreState } from "@app/classes/graphql/core/core"
import { Service } from "typedi"
import { Upload } from "@app/models/upload.model"
import { DateType } from "@app/classes/graphql/serializers/date"

@Resolver(Upload)
@Service()
export class UploadResolver {}
