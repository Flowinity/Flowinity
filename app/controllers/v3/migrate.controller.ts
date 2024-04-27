import { JsonController, Post } from "routing-controllers"
import { Service } from "typedi"
import Errors from "@app/lib/errors"

@Service()
@JsonController("/migrate")
export class MigrateControllerV3 {
  @Post("/colubrina")
  async migrateColubrina() {
    throw Errors.FEATURE_REMOVED
  }
}
