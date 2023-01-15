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
import { HttpException } from "@app/classes/http.exception"
import { AuthController } from "@app/controllers/auth.controller"
import { FileController } from "@app/controllers/file.controller"
import { CollectionController } from "@app/controllers/collection.controller"

@Service()
export class Application {
  app: express.Application
  private readonly swaggerOptions: swaggerJSDoc.Options

  constructor(
    private readonly userutilsController: UserUtilsController,
    private readonly dateController: DateController,
    private readonly coreController: CoreController,
    private readonly galleryController: GalleryController,
    private readonly authController: AuthController,
    private readonly fileController: FileController,
    private readonly collectionController: CollectionController
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
    this.app.use("/api/v2/auth", this.authController.router)
    this.app.use("/api/v2/collections", this.collectionController.router)
    this.app.use("/i", this.fileController.router)
    this.app.use("/api/date", this.dateController.router)
    this.app.use("*", (req, res) => {
      throw Errors.NOT_FOUND
    })
    this.app.use((err: any, req: any, res: any, next: any) => {
      console.warn(err)
      if (err?.status) {
        res.status(err?.status || 500).send({
          errors: [err]
        })
      } else {
        res.status(500).send({
          errors: [Errors.UNKNOWN]
        })
      }
    })
    this.errorHandling()
  }

  private config(): void {
    // Middlewares configuration
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(cors())
  }

  private errorHandling(): void {
    // When previous handlers have not served a request: path wasn't found
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const err: HttpException = new HttpException("Not Found")
        next(err)
      }
    )

    // development error handler
    // will print stacktrace
    if (this.app.get("env") === "development") {
      this.app.use(
        (err: HttpException, req: express.Request, res: express.Response) => {
          res.status(err.status || 500)
          res.send({
            message: err.message,
            error: err
          })
        }
      )
    }

    // production error handler
    // no stacktraces  leaked to user (in production env only)
    this.app.use(
      (err: HttpException, req: express.Request, res: express.Response) => {
        res.status(err.status || 500)
        res.send({
          message: err.message,
          error: {}
        })
      }
    )
  }
}
