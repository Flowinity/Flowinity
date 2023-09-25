import { NextFunction, Response } from "express"
import { Session } from "@app/models/session.model"
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"
import { Theme } from "@app/models/theme.model"
import { Domain } from "@app/models/domain.model"
import { Op } from "sequelize"
import maxmind, { AsnResponse, CityResponse, Reader } from "maxmind"
import { Subscription } from "@app/models/subscription.model"
import { Experiment } from "@app/models/experiment.model"
import Errors from "@app/lib/errors"
import { Integration } from "@app/models/integration.model"
import { createParamDecorator } from "routing-controllers"
import { RequestAuthSystem } from "@app/types/express"
import { Badge } from "@app/models/badge.model"
import { AccessedFrom } from "@app/classes/graphql/user/session"

let asn: Reader<AsnResponse>
let city: Reader<CityResponse>
maxmind
  .open<AsnResponse>(process.cwd() + "/app/lib/GeoLite2-ASN.mmdb")
  .then((reader) => {
    asn = reader
  })

maxmind
  .open<CityResponse>(process.cwd() + "/app/lib/GeoLite2-City.mmdb")
  .then((reader) => {
    city = reader
  })

export type Scope =
  | "uploads.create"
  | "uploads.modify"
  | "uploads.view"
  | "user.view"
  | "user.modify"
  | "collections.modify"
  | "collections.create"
  | "collections.view"
  | "workspaces.view"
  | "workspaces.create"
  | "workspaces.modify"
  | "chats.view"
  | "chats.create"
  | "chats.send"
  | "chats.edit"
  | "insights.view"
  | "starred.view"
  | "starred.modify"
  | "admin.ci"
  | "user"
  | "collections"
  | "workspaces"
  | "chats"
  | "insights"
  | "starred"
  | "admin"
  | "*"
  | "mail.view"
  | "mail.create"
  | "mail"
  | "oauth"
  | "oauth.user.email"
  | "oauth.user.id"
  | "oauth.user.username"
  | "oauth.user.avatar"
  | "oauth.save"
  | "oauth.user"
  | "oauth.authorize"
  | "none"
  | "dev.view"
  | "dev.modify"

async function getSession(token: string) {
  return await Session.findOne({
    where: {
      token: token,
      expiredAt: {
        [Op.or]: [
          {
            [Op.gt]: new Date()
          },
          {
            [Op.is]: null
          }
        ]
      }
    },
    include: [
      {
        model: User,
        as: "user",
        required: true,
        include: [
          {
            model: Experiment,
            as: "experiments"
          },
          {
            model: Subscription,
            as: "subscription"
          },
          {
            model: Domain,
            as: "domain"
          },
          {
            model: Plan,
            as: "plan"
          },
          {
            model: Theme,
            as: "theme"
          },
          {
            model: Integration,
            as: "integrations",
            attributes: [
              "id",
              "type",
              "providerUserId",
              "providerUsername",
              "providerUserCache",
              "error",
              "createdAt",
              "updatedAt"
            ]
          },
          {
            model: Badge,
            as: "badges"
          }
        ],
        order: [
          [{ model: Badge, as: "badges" }, "priority", "DESC"],
          [{ model: Badge, as: "badges" }, "id", "ASC"]
        ]
      }
    ]
  })
}

export function checkScope(requiredScope: string | string[], scope: string) {
  if (
    requiredScope === "none" ||
    requiredScope?.length === 0 ||
    (typeof requiredScope === "object" && requiredScope?.includes("none")) ||
    (typeof requiredScope === "object" && requiredScope?.includes(""))
  )
    return true
  if (scope === undefined) return true
  if (scope === "") {
    return false
  }
  if (scope === "*") {
    return true
  }
  // scope is the current session scope, and requiredScope is the scope required for the route, formatted like user.read or user.write
  // check if the required scope is contained in the current scope, comma separated
  const scopes = scope.split(",")
  for (const scope of scopes) {
    if (typeof requiredScope === "string") {
      if (scope === requiredScope) {
        return true
      } else if (scope?.split(".")[0] === requiredScope) {
        return true
      }
    } else {
      if (requiredScope.includes(scope)) {
        return true
      } else if (requiredScope.includes(scope?.split(".")[0])) {
        return true
      }
    }
  }
  return false
}

export async function updateSession(session: Session, ip: string) {
  if (
    session.updatedAt.getTime() + 5 * 60 * 1000 > new Date().getTime() &&
    session.info?.accessedFrom?.length
  )
    return
  if (session.type === "session") {
    session
      .update({
        expiredAt: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
      })
      .then(() => {})
  }
  let accessedFrom = session.info?.accessedFrom || []
  if (!accessedFrom.find((aF: AccessedFrom) => aF.ip === ip)) {
    const asnResponse = await asn?.get(ip)
    const cityResponse = await city?.get(ip)
    accessedFrom.push({
      isp: asnResponse?.autonomous_system_organization,
      location: cityResponse?.city?.names?.en,
      ip: ip,
      date: new Date().toISOString(),
      asn: asnResponse?.autonomous_system_number
    })
  }
  await Session.update(
    {
      info: {
        ...session.info,
        accessedFrom: accessedFrom
      }
    },
    {
      where: {
        id: session.id
      }
    }
  )
}

export async function simpleAuth(req: RequestAuthSystem, res: Response) {
  const token = req.header("Authorization")

  if (!token) return { id: undefined }

  const session = await getSession(<string>token)

  if (!session?.user) return { id: undefined }

  return session?.user
}

export async function authSystem(
  scope: string | string[],
  passthrough: boolean = false,
  req: RequestAuthSystem,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")
  if (!scope) scope = "*"
  if (token) {
    const session = await getSession(token)
    if (session) {
      if (!checkScope(scope, session.scopes)) {
        if (passthrough) {
          req.user = null
          return next()
        }
        res.status(401)
        res.json({
          errors: [
            {
              name: "SCOPE_REQUIRED",
              message:
                "You do not have permission to access this resource due to your current API key scopes.",
              requiredScope: scope,
              status: 401
            }
          ]
        })
        updateSession(session, req.ip).then(() => {})
        return
      }
      if (session.user?.banned) {
        if (passthrough) {
          req.user = null
          return next()
        }
        res.status(401)
        res.json({
          errors: [Errors.BANNED]
        })
        updateSession(session, req.ip).then(() => {})
        return
      } else {
        req.user = session.user
        if (!req.user.emailVerified) {
          session.user.dataValues.scopes = "user.view,user.modify"
        } else {
          session.user.dataValues.scopes = session.scopes
        }
        if (!scope.includes("user") && !req.user.emailVerified) {
          if (passthrough) {
            req.user = null
            return next()
          }
          res.status(401)
          res.json({
            errors: [Errors.EMAIL_NOT_VERIFIED]
          })
          updateSession(session, req.ip).then(() => {})
          return
        }
        next()
        updateSession(session, req.ip).then(() => {})
        return session
      }
    } else {
      if (passthrough) {
        req.user = null
        return next()
      }
      res.status(401)
      res.json({
        errors: [
          {
            name: "INVALID_TOKEN",
            message:
              "The authorization token you provided is invalid or has expired.",
            status: 401
          }
        ]
      })
    }
  } else {
    if (passthrough) {
      req.user = null
      return next()
    }
    res.status(401)
    res.json({
      errors: [
        {
          name: "INVALID_TOKEN",
          message:
            "The authorization token you provided is invalid or has expired.",
          status: 401
        }
      ]
    })
  }
}

const auth = (scope: string | string[], passthrough: boolean = false) => {
  return async function (req: any, res: Response, next: NextFunction) {
    try {
      return await authSystem(scope, passthrough, req, res, next)
    } catch (err) {
      console.log(err)
      if (passthrough) {
        req.user = null
        return next()
      }
      res.status(401)
      res.json({
        errors: [
          {
            name: "INVALID_TOKEN",
            message: "Your authorization token is invalid or has expired.",
            status: 401
          }
        ]
      })
    }
  }
}

export function Auth(scope: Scope | Scope[], required: boolean = true) {
  return createParamDecorator({
    required,
    value: async (action) => {
      if (config.maintenance.enabled)
        throw {
          name: "MAINTENANCE",
          message: `${config.maintenance.message}\n\nFor more information visit ${config.maintenance.statusPage}`,
          status: 400
        }

      if (!config.finishedSetup && !required) return null
      if (!config.finishedSetup) throw Errors.NOT_SETUP
      const token = action.request.header("Authorization")
      if (!scope) scope = "*"
      if (token) {
        const session = await getSession(token)

        if (session) {
          if (!checkScope(scope, session.scopes)) {
            updateSession(session, action.request.ip).then(() => {})
            if (!required) return null
            throw Errors.SCOPE_REQUIRED
          }
          if (session.user?.banned) {
            updateSession(session, action.request.ip).then(() => {})
            if (!required) return null
            throw Errors.BANNED
          } else {
            if (!session.user.emailVerified) {
              session.user.dataValues.scopes = "user.view,user.modify"
            } else {
              session.user.dataValues.scopes = session.scopes
            }
            if (!scope.includes("user") && !session.user.emailVerified) {
              updateSession(session, action.request.ip).then(() => {})
              throw Errors.EMAIL_NOT_VERIFIED
            }
            updateSession(session, action.request.ip).then(() => {})

            session.user.dataValues.stats = await redis.json.get(
              `userStats:${session?.user.id}`
            )

            if (session.oauthAppId) {
              session.user.dataValues.oauthAppId = session.oauthAppId
            }

            return session.toJSON().user
          }
        } else {
          if (!required) return null
          throw Errors.INVALID_TOKEN
        }
      } else {
        if (!required) return null
        throw Errors.INVALID_TOKEN
      }
    }
  })
}

export default auth
