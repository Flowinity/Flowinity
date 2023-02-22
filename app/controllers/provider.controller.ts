import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"
import { ProviderService } from "@app/services/provider.service"
import Errors from "@app/lib/errors"

@Service()
export class ProviderController {
  router: any

  constructor(private readonly providerService: ProviderService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.get(
      "/tenor",
      auth("chats.view"),
      async (req: RequestAuth, res: Response) => {
        if (!req.query.search) throw Errors.INVALID_SEARCH
        const tenor = await this.providerService.tenor(
          <string>req.query.search,
          <string>req.query.next
        )
        res.json(tenor)
      }
    )
  }
}
