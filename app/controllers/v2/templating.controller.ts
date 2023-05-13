import { Request, Response } from "express"
import { Service } from "typedi"
import Router from "express-promise-router"
import auth from "@app/lib/auth"

@Service()
export class UserUtilsController {
  router: any
  definitions: any

  constructor() {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()
    this.definitions = {
      "/home": {
        name: "Home"
      },
      "/login": {
        name: "Login"
      },
      "/register": {
        name: "Register"
      },
      "/collection/*": {
        name: "Collection"
      },
      "/collections": {
        name: "Collections"
      }
    }
    this.router.get(
      "/:attachment",
      auth("user.view", true),
      async (req: Request, res: Response) => {
        return res.render("../dist/index.html", {
          meta: {
            title: req
          }
        })
      }
    )
    this.router.get(
      "*",
      auth("user.view", true),
      async (req: Request, res: Response) => {
        res.render("../dist/index.html", {
          meta: {
            title: req
          }
        })
      }
    )
  }
}
