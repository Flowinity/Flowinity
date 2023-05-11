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
import { MigrateController } from "@app/controllers/migrate.controller"
import { ChatController } from "@app/controllers/chat.controller"
import { MediaProxyController } from "@app/controllers/mediaProxy.controller"
import { ProviderController } from "@app/controllers/provider.controller"
import { User } from "@app/models/user.model"
import { Op } from "sequelize"
import { MailController } from "@app/controllers/mail.controller"
import { Request, Response, NextFunction } from "express"
import {
  useExpressServer,
  Middleware,
  ExpressErrorMiddlewareInterface,
  HttpError,
  useContainer
} from "routing-controllers"
import { Container } from "typedi"
//v3 controllers
import { UserControllerV3 } from "@app/controllers/v3/user.controller"
import { AuthControllerV3 } from "@app/controllers/v3/auth.controller"
import { CoreControllerV3 } from "@app/controllers/v3/core.controller"
import { ChatControllerV3 } from "@app/controllers/v3/chat.controller"
import { AdminControllerV3 } from "@app/controllers/v3/admin.controller"
import { AutoCollectControllerV3 } from "@app/controllers/v3/autoCollect.controller"
import { GalleryControllerV3 } from "@app/controllers/v3/gallery.controller"
import { CollectionControllerV3 } from "@app/controllers/v3/collection.controller"
import { FileControllerV3 } from "@app/controllers/v3/file.controller"
import { WorkspaceControllerV3 } from "@app/controllers/v3/workspace.controller"
import { ApiSchema } from "@app/schema"
import { DomainControllerV3 } from "@app/controllers/v3/domain.controller"
import { SecurityControllerV3 } from "@app/controllers/v3/security.controller"
import { InviteControllerV3 } from "@app/controllers/v3/invite.controller"
import { PulseControllerV3 } from "@app/controllers/v3/pulse.controller"
import { MediaProxyControllerV3 } from "@app/controllers/v3/mediaProxy.controller"
import { ProviderControllerV3 } from "@app/controllers/v3/provider.controller"
import { MailControllerV3 } from "@app/controllers/v3/mail.controller"
import { FallbackControllerV3 } from "@app/controllers/v3/fallback.controller"
import { MigrateControllerV3 } from "@app/controllers/v3/migrate.controller"

@Service()
@Middleware({ type: "after" })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(err: any, req: any, res: any, next: (err: any) => any) {
    console.log(err)
    if (err?.status && !err?.errno) {
      return res.status(err?.status || 500).json({
        errors: [
          {
            name: Object.entries(Errors).find(
              ([key, value]) => value.message === err.message
            )?.[0],
            ...err
          }
        ]
      })
    } else if (err instanceof sequelize.ValidationError) {
      return res.status(400).json({
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
    } else if (err?.issues) {
      return res.status(400).json({
        errors: Object.keys(err.issues).map((e: any) => {
          return {
            status: 400,
            message: err.issues[e].path[0] + ": " + err.issues[e].message,
            name: "Troplo/ValidationError"
          }
        })
      })
    } else if (
      (err?.message && err?.expose !== undefined) ||
      err instanceof HttpError
    ) {
      if (err.expose === false) {
        return res.status(500).json({
          errors: [
            {
              ...Errors.UNKNOWN,
              name: "UNKNOWN"
            }
          ]
        })
      }
      return res.status(err?.httpStatus || 400).json({
        errors: [
          {
            status: err?.httpStatus || 400,
            message: err.message,
            name: "Troplo/ValidationError"
          }
        ]
      })
    } else {
      return res.status(500).json({
        errors: [
          {
            ...Errors.UNKNOWN,
            name: "UNKNOWN"
          }
        ]
      })
    }
  }
}
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
    private readonly noteController: NoteController,
    private readonly migrateController: MigrateController,
    private readonly chatController: ChatController,
    private readonly mediaProxyController: MediaProxyController,
    private readonly providerController: ProviderController,
    private readonly mailController: MailController
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
      res.setHeader("X-Powered-By", "TroploPrivateUploader/3.0.0")
      next()
    })
    useContainer(Container)
    useExpressServer(this.app, {
      controllers: [
        UserControllerV3,
        AuthControllerV3,
        CoreControllerV3,
        ChatControllerV3,
        AutoCollectControllerV3,
        GalleryControllerV3,
        CollectionControllerV3,
        AdminControllerV3,
        FileControllerV3,
        WorkspaceControllerV3,
        DomainControllerV3,
        SecurityControllerV3,
        InviteControllerV3,
        PulseControllerV3,
        MediaProxyControllerV3,
        ProviderControllerV3,
        MailControllerV3,
        MigrateControllerV3
      ],
      routePrefix: "/api/v3",
      middlewares: [HttpErrorHandler],
      defaultErrorHandler: false,
      classTransformer: false,
      defaults: {
        undefinedResultCode: 204,
        nullResultCode: 404
      },
      validation: true
    })
    const spec = ApiSchema.generateSchema()
    this.app.use("/api/docs", async (req, res, next) => {
      res.redirect("/api/v3/docs")
    })
    this.app.use(
      "/api/v2/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(this.swaggerOptions))
    )
    this.app.use("/api/v3/docs", swaggerUi.serve, swaggerUi.setup(spec))
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
    this.app.use("/api/v2/migrate", this.migrateController.router)
    this.app.use("/api/v2/chats", this.chatController.router)
    this.app.use("/api/v2/mediaproxy", this.mediaProxyController.router)
    this.app.use("/api/v2/providers", this.providerController.router)
    this.app.use("/api/v2/mail", this.mailController.router)
    this.app.use("/i/", this.fileController.router)
    this.app.use("/api/v1/gallery", this.galleryController.router)
    this.app.use("/api/v1/site", this.coreController.router)
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
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
                  ?.replace(
                    /Validation (.*?) on (.*?) failed/,
                    "$2 is invalid."
                  )
                  .replace("notNull Violation: ", "")
                  .replace("cannot be null", "is required."),
                name: "Troplo/ValidationError"
              }
            })
          })
        } else if (err?.issues) {
          console.log(err)
          res.status(400).send({
            errors: Object.keys(err.issues).map((e: any) => {
              return {
                status: 400,
                message: err.issues[e].path[0] + ": " + err.issues[e].message,
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
      }
    )
    useExpressServer(this.app, {
      controllers: [FileControllerV3, FallbackControllerV3],
      routePrefix: "",
      middlewares: [HttpErrorHandler],
      defaultErrorHandler: false,
      classTransformer: false,
      defaults: {
        undefinedResultCode: 204,
        nullResultCode: 404
      },
      validation: true
    })
    this.onServerStart()
  }

  private config(): void {
    // Middlewares configuration
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(cors())
    this.app.set("view engine", "ejs")
  }

  private async onServerStart() {
    await User.update(
      {
        status: "offline"
      },
      {
        where: {
          status: {
            [Op.not]: "offline"
          }
        }
      }
    )
  }
}
