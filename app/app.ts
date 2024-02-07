import express, { NextFunction } from "express"
import {
  BadRequestError,
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
  useContainer,
  useExpressServer
} from "routing-controllers"
import cookieParser from "cookie-parser"
import cors from "cors"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Container, Service } from "typedi"
import sequelize, { Op, ValidationError } from "sequelize"
import path from "path"
import fs from "fs"

// Import Libs
import Errors from "@app/lib/errors"
import wellKnownOidc from "@app/lib/well-known-oidc"

// Import Schemas
import { ApiSchema } from "@app/schema"

// Import Models
import { User } from "@app/models/user.model"

// Import Controllers (v3)
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
import { DomainControllerV3 } from "@app/controllers/v3/domain.controller"
import { SecurityControllerV3 } from "@app/controllers/v3/security.controller"
import { InviteControllerV3 } from "@app/controllers/v3/invite.controller"
import { PulseControllerV3 } from "@app/controllers/v3/pulse.controller"
import { MediaProxyControllerV3 } from "@app/controllers/v3/mediaProxy.controller"
import { ProviderControllerV3 } from "@app/controllers/v3/provider.controller"
import { MailControllerV3 } from "@app/controllers/v3/mail.controller"
import { FallbackControllerV3 } from "@app/controllers/v3/fallback.controller"
import { MigrateControllerV3 } from "@app/controllers/v3/migrate.controller"
import { SlideshowControllerV3 } from "@app/controllers/v3/slideshow.controller"
import { SetupControllerV3 } from "@app/controllers/v3/setup.controller"
import { InstanceControllerV3 } from "@app/controllers/v3/instance.controller"
import { OauthControllerV3 } from "@app/controllers/v3/oauth.controller"
import { OidcControllerV3 } from "@app/controllers/v3/oidc.controller"

// GraphQL
import { createYoga, maskError, YogaServerInstance } from "graphql-yoga"
import { useHive } from "@graphql-hive/client"
import { execSync } from "child_process"
import { GraphQLError } from "graphql/error"
//@ts-ignore
import { createFetch } from "@whatwg-node/fetch"
import { createRedisCache } from "@envelop/response-cache-redis"
import { Cache } from "@envelop/response-cache"
import redis from "@app/redis"
import { GraphQLSchema } from "graphql/type"
import generateContext from "@app/classes/graphql/middleware/generateContext"
import { MulterError } from "multer"
import { ZodError } from "zod"
import { generateSchema } from "@app/lib/generateSchema"
import { GqlError } from "@app/lib/gqlErrors"

@Service()
@Middleware({ type: "after" })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(err: any, res: any) {
    if (err instanceof MulterError) {
      return res.status(400).json({
        errors: [
          {
            name: err.code,
            message: err.message,
            status: 400
          }
        ]
      })
    } else if (err?.status && !err?.errno) {
      return res.status(err?.status || 500).json({
        errors: [
          {
            name: Object.entries(Errors).find(
              ([, value]): boolean => value.message === err.message
            )?.[0],
            ...err
          }
        ]
      })
    } else if (err instanceof sequelize.ValidationError) {
      return res.status(400).json({
        errors: err.errors.map(
          (e: any): { message: any; name: string; status: number } => {
            return {
              status: 400,
              message: e.message
                ?.replace(/Validation (.*?) on (.*?) failed/, "$2 is invalid.")
                .replace("notNull Violation: ", "")
                .replace("cannot be null", "is required."),
              name: "Troplo/ValidationError"
            }
          }
        )
      })
    } else if (err?.issues) {
      return res.status(400).json({
        errors: Object.keys(err.issues).map(
          (e: any): { message: any; name: string; status: number } => {
            return {
              status: 400,
              message: err.issues[e].path[0] + ": " + err.issues[e].message,
              name: "Troplo/ValidationError"
            }
          }
        )
      })
    } else if (
      (err?.message && err?.expose !== undefined) ||
      err instanceof HttpError ||
      err instanceof BadRequestError ||
      err?.httpCode
    ) {
      if (!err.expose) {
        return res.status(500).json({
          errors: [
            {
              ...Errors.UNKNOWN,
              name: "UNKNOWN"
            }
          ]
        })
      }
      return res.status(err?.httpStatus || err?.httpCode || 400).json({
        errors: [
          {
            status: err?.httpStatus || err?.httpCode || 400,
            message: err.message,
            name: "Troplo/BadRequest"
          }
        ]
      })
    } else if (err?.message && err?.expose === undefined && err?.status) {
      return res.status(400).json({
        errors: [
          {
            status: 400,
            message: err.message,
            name: "Troplo/BadRequest"
          }
        ]
      })
    } else {
      console.log(err)
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
  schema: GraphQLSchema
  yogaApp: YogaServerInstance<any, any>
  private readonly swaggerOptions: swaggerJSDoc.Options

  constructor() {
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
  createExpressServerV3(endpoint: string) {
    useExpressServer(this.app, {
      controllers: config.finishedSetup
        ? [
            UserControllerV3,
            AuthControllerV3,
            CoreControllerV3,
            ...(config?.features?.communications ? [ChatControllerV3] : []),
            ...(config?.features?.autoCollects
              ? [AutoCollectControllerV3]
              : []),
            GalleryControllerV3,
            ...(config?.features?.collections ? [CollectionControllerV3] : []),
            AdminControllerV3,
            FileControllerV3,
            ...(config?.features?.workspaces ? [WorkspaceControllerV3] : []),
            DomainControllerV3,
            SecurityControllerV3,
            InviteControllerV3,
            PulseControllerV3,
            MediaProxyControllerV3,
            ProviderControllerV3,
            MailControllerV3,
            MigrateControllerV3,
            SlideshowControllerV3,
            ...(config?.officialInstance ? [InstanceControllerV3] : []),
            OauthControllerV3,
            OidcControllerV3
          ]
        : [SetupControllerV3, CoreControllerV3],
      routePrefix: endpoint,
      middlewares: [HttpErrorHandler],
      defaultErrorHandler: false,
      classTransformer: false,
      defaults: {
        undefinedResultCode: 204,
        nullResultCode: 404
      },
      validation: true
    })
  }

  async bindRoutes() {
    process.env.TPU_COMMIT_HASH = execSync("git rev-parse --short HEAD")
      .toString()
      .trim()
    this.app.use((req, res, next: NextFunction): void => {
      res.setHeader("X-Powered-By", "Flowinity/4.0.0")
      next()
    })

    useContainer(Container)

    this.createExpressServerV3("/api/v3")
    this.createExpressServerV3("/api/v2")

    // For clients that still use /api/v1, the schema is still the same for upload API, so we'll use v3
    useExpressServer(this.app, {
      controllers: config.finishedSetup ? [GalleryControllerV3] : [],
      routePrefix: "/api/v1",
      middlewares: [HttpErrorHandler],
      defaultErrorHandler: false,
      classTransformer: false,
      defaults: {
        undefinedResultCode: 204,
        nullResultCode: 404
      },
      validation: true
    })

    // OIDC
    /*const provider = new Provider("http://localhost:34583", {
      adapter: OidcAdapter
    })
    provider.listen(34583, () => {})*/
    this.app.get("/.well-known/openid-configuration", (req, res) => {
      res.json(wellKnownOidc())
    })
    this.app.use("/api/docs", async (req, res): Promise<void> => {
      res.redirect("/api/v3/docs")
    })
    this.app.use(
      "/api/v2/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(this.swaggerOptions))
    )

    if (config.finishedSetup) {
      const spec = ApiSchema.generateSchema()
      this.app.use("/api/v3/docs", swaggerUi.serve, swaggerUi.setup(spec))
    }

    useExpressServer(this.app, {
      controllers: config.finishedSetup
        ? [FileControllerV3, FallbackControllerV3]
        : [FallbackControllerV3],
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
    this.schema = await generateSchema()
    const gqlPlugins = []
    global.gqlCache = createRedisCache({ redis })
    if (config.hive?.enabled) {
      gqlPlugins.push(
        useHive({
          enabled: true,
          token: config.hive.token,
          reporting: {
            author: "PrivateUploader",
            commit: process.env.TPU_COMMIT_HASH || "unknown"
          },
          // Collects and send usage reporting based on executed operations
          usage: {
            clientInfo(context: any) {
              // Some versions of TPUvNEXT used the clientName/clientVersion headers.
              const name = context?.request?.headers
                ? context.request.headers.get("x-tpu-client") ||
                  context.request.headers.get("clientName")
                : context.connectionParams?.["x-tpu-client"] ||
                  context.connectionParams?.["clientname"]
              const version = context?.request?.headers
                ? context.request.headers.get("x-tpu-client-version") ||
                  context.request.headers.get("clientVersion")
                : context.connectionParams?.["x-tpu-client-version"] ||
                  context.connectionParams?.["clientversion"]

              if (name && version) {
                return { name, version }
              }

              return null
            }
          },
          selfHosting: {
            graphqlEndpoint: config.hive.graphqlEndpoint,
            usageEndpoint: config.hive.usageEndpoint,
            applicationUrl: config.hive.applicationUrl
          }
        })
      )
    }

    this.yogaApp = createYoga({
      schema: this.schema,
      plugins: gqlPlugins,
      graphiql: {
        subscriptionsProtocol: "WS"
      },
      landingPage: false,
      fetchAPI: createFetch({
        formDataLimits: {
          // Maximum allowed file size (in bytes)
          fileSize: 1.37439e11,
          // Maximum allowed number of files
          files: 200,
          // Maximum allowed size of content (operations, variables etc...)
          fieldSize: 1000000,
          // Maximum allowed header size for form data
          headerSize: 1000000
        }
      }),
      maskedErrors: {
        maskError(error: any, message: any, isDev: any): Error {
          if (error instanceof ZodError) {
            return {
              message: error.message || "Validation error!",
              name: "VALIDATION_ERROR"
            }
          }

          if (error instanceof ValidationError) {
            return {
              message: error.toString(),
              name: error.name
            }
          }

          console.log(error)

          const msg = error.message.toLowerCase()

          if (
            msg.includes("sqlstate") ||
            msg.includes("sequelize") ||
            msg.includes("typeerror") ||
            msg.includes("property")
          ) {
            console.error(error)
            return maskError(error, message, isDev)
          }

          if (error instanceof GqlError || error instanceof GraphQLError) {
            return error
          }

          if (
            config.release === "dev" ||
            process.env.NODE_ENV === "development"
          ) {
            console.error(error)
          }

          return maskError(error, message, isDev)
        }
      },
      async context(ctx) {
        return await generateContext(ctx)
      }
    })

    this.app.use(express.static(path.join(global.appRoot, "../frontend_build")))
    this.app.get("*", function (req, res, next): void {
      if (req.url.startsWith("/api/")) return next()
      if (req.url.startsWith("/i/")) return next()
      try {
        const file = path.resolve(
          global.appRoot,
          "../frontend_build/index.html"
        )
        fs.statSync(file)
        res.sendFile(file)
      } catch (e) {
        res.status(500)
        res.render("frontend-compile", {
          //@ts-ignore
          path: e?.path || "unknown"
        })
      }
    })
    this.onServerStart() // TODO: Fix "Promise returned from onServerStart is ignored".
  }

  private config() {
    // Middleware configuration
    this.app.use(
      express.json({
        limit: "100mb"
      })
    )
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(cors())
    this.app.set("view engine", "ejs")
    this.app.set("views", path.join(global.appRoot, "/views"))
  }

  private async onServerStart() {
    if (config.finishedSetup) {
      try {
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
        // delete all Redis keys containing user:*:platforms to reset statuses
        const keys = await redis.keys("user:*:platforms")
        for (const key of keys) {
          await redis.del(key)
        }
      } catch {}
    }
  }
}
