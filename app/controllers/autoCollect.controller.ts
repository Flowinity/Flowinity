import { Service } from "typedi"

import Router from "express-promise-router"
import { AutoCollectService } from "@app/services/autoCollect.service";
import auth from "@app/lib/auth";
import { RequestAuth } from "@app/types/express";
import {Response} from "express";
@Service()
export class AutoCollectController {
  router: any

  constructor(private readonly autoCollectService: AutoCollectService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()
    
    this.router.get("/", auth("collections.view"), async (req: RequestAuth, res: Response) => {
      const autoCollects = await this.autoCollectService.getAutoCollects()
      res.json(autoCollects)
    })
  }
}
