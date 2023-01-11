import { HttpException } from "@app/classes/http.exception"
import { DateController } from "@app/controllers/date.controller"
import * as cookieParser from "cookie-parser"
import * as cors from "cors"
import * as express from "express"
import { StatusCodes } from "http-status-codes"
import * as swaggerJSDoc from "swagger-jsdoc"
import * as swaggerUi from "swagger-ui-express"
import { Service } from "typedi"
import { UserUtilsController } from "@app/controllers/userutils.controller"

@Service()
export class Application {
  app: express.Application
  private readonly internalError: number = StatusCodes.INTERNAL_SERVER_ERROR
  private readonly swaggerOptions: swaggerJSDoc.Options

  constructor(
    private readonly userutilsController: UserUtilsController,
    private readonly dateController: DateController
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
    this.app.use("/api/v2/userutils", this.userutilsController.router)
    this.app.use("/api/date", this.dateController.router)
    this.app.use("/", (req, res) => {
      res.redirect("/api/docs")
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
          res.status(err.status || this.internalError)
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
        res.status(err.status || this.internalError)
        res.send({
          message: err.message,
          error: {}
        })
      }
    )
  }
}
