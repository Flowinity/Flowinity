import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"
import { MigrateService } from "@app/services/migrate.service"

@Service()
export class MigrateController {
  router: any

  constructor(private readonly migrateService: MigrateService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.post(
      "/colubrina",
      auth("user.modify"),
      async (req: RequestAuth, res: Response) => {
        await this.migrateService.colubrina(
          req.body.username,
          req.body.password,
          req.user.id
        )
        res.sendStatus(204)
      }
    )
  }
}
