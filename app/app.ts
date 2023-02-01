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
import { DomainController } from "@app/controllers/domain.controller"
import { AdminController } from "@app/controllers/admin.controller"
import { SecurityController } from "@app/controllers/security.controller"
import { AutoCollectController } from "@app/controllers/autoCollect.controller"
import { SlideshowController } from "@app/controllers/slideshow.controller"
import { InviteController } from "@app/controllers/invite.controller"
import sequelize from "sequelize"
import { PulseController } from "@app/controllers/pulse.controller"
import { NoteController } from "@app/controllers/note.controller"

@Service()
export class Application {
  app: express.Application
  private readonly swaggerOptions: swaggerJSDoc.Options

  constructor(
    private readonly userutilsController: UserUtilsController,
    private readonly coreController: CoreController,
    private readonly galleryController: GalleryController,
    private readonly authController: AuthController,
    private readonly fileController: FileController,
    private readonly collectionController: CollectionController,
    private readonly domainController: DomainController,
    private readonly adminController: AdminController,
    private readonly securityController: SecurityController,
    private readonly autoCollectController: AutoCollectController,
    private readonly slideshowController: SlideshowController,
    private readonly inviteController: InviteController,
    private readonly pulseController: PulseController,
    private readonly noteController: NoteController
  ) {
    this.app = express()

    this.swaggerOptions = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "TPUv2 Server",
          version: "1.0.0",
          description:
            "Documentation is currently a work in progress and is very incomplete."
        }
      },
      apis: ["app/controllers/*.ts"]
    }

    this.config()

    this.bindRoutes()
  }

  bindRoutes(): void {
    this.app.use((req, res, next) => {
      res.setHeader("X-Powered-By", "TroploPrivateUploader/2.0.0")
      next()
    })
    this.app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(this.swaggerOptions))
    )
    this.app.use(
      "/api/v2/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(this.swaggerOptions))
    )
    this.app.use("/api/v2/user", this.userutilsController.router)
    this.app.use("/api/v2/core", this.coreController.router)
    this.app.use("/api/v2/gallery", this.galleryController.router)
    this.app.use("/api/v2/auth", this.authController.router)
    this.app.use("/api/v2/collections", this.collectionController.router)
    this.app.use("/api/v2/domains", this.domainController.router)
    this.app.use("/api/v2/admin", this.adminController.router)
    this.app.use("/api/v2/security", this.securityController.router)
    this.app.use("/api/v2/autoCollects", this.autoCollectController.router)
    this.app.use("/api/v2/slideshows", this.slideshowController.router)
    this.app.use("/api/v2/invites", this.inviteController.router)
    this.app.use("/api/v2/pulse", this.pulseController.router)
    this.app.use("/api/v2/notes", this.noteController.router)
    this.app.use("/i/", this.fileController.router)
    this.app.use("/api/v1/gallery", this.galleryController.router)
    this.app.use("/api/v1/site", this.coreController.router)
    this.app.use("/api/v1", async (req, res) => {
      res.status(410).json({
        errors: [Errors.API_REMOVED]
      })
    })
    this.app.use("*", (req, res) => {
      throw Errors.NOT_FOUND
    })
    this.app.use((err: any, req: any, res: any, next: any) => {
      if (err?.status && !err?.errno) {
        console.log(err)
        res.status(err?.status || 500).send({
          errors: [err]
        })
      } else if (err instanceof sequelize.ValidationError) {
        res.status(400).send({
          errors: err.errors.map((e: any) => {
            return {
              status: 400,
              message: e.message
                ?.replace(/Validation (.*?) on (.*?) failed/, "$2 is invalid.")
                .replace("notNull Violation: ", "")
                .replace("cannot be null", "is required."),
              name: "Troplo/ValidationError"
            }
          })
        })
      } else {
        console.log(err)
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
