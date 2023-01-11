import { DateController } from "@app/controllers/date.controller"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Service } from "typedi"
import { UserUtilsController } from "@app/controllers/userutils.controller"
import { CoreController } from "@app/controllers/core.controller"
import { GalleryController } from "@app/controllers/gallery.controller"
import Errors from "@app/lib/errors"

@Service()
export class Application {
  app: express.Application
  private readonly swaggerOptions: swaggerJSDoc.Options

  constructor(
    private readonly userutilsController: UserUtilsController,
    private readonly dateController: DateController,
    private readonly coreController: CoreController,
    private readonly galleryController: GalleryController
  ) {
    this.app = express()

    this.swaggerOptions = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "TPUv2 Server",
          version: "1.0.0"
        }
      },
      apis: ["**/*.ts"]
    }

    this.config()

    this.bindRoutes()
  }

  bindRoutes(): void {
    this.app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(this.swaggerOptions))
    )
    this.app.use("/api/v2/user", this.userutilsController.router)
    this.app.use("/api/v2/core", this.coreController.router)
    this.app.use("/api/v2/gallery", this.galleryController.router)
    this.app.use("/api/date", this.dateController.router)
    this.app.use("*", (req, res) => {
      throw Errors.NOT_FOUND
    })
  }

  private config(): void {
    // Middlewares configuration
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(cors())
  }
}
