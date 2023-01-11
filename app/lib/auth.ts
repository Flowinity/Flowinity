import { Response, Request, NextFunction } from "express"
import { Session } from "@app/models/session.model"
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"

function checkScope(requiredScope: string, scope: string) {
  if (scope === "*") {
    return true
  }
  // scope is the current session scope, and requiredScope is the scope required for the route, formatted like user.read or user.write
  // check if the required scope is contained in the current scope, comma separated
  const scopes = scope.split(",")
  for (const scope of scopes) {
    if (scope === requiredScope) {
      return true
    }
    if (scope?.split(".")[0] === requiredScope) {
      return true
    }
  }
  return false
}

const auth = (scope: string) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")
      if (!scope) scope = "*"
      if (token) {
        // @ts-ignore
        const session = await Session.findOne({
          where: {
            token: token
          },
          include: [
            {
              model: User,
              as: "user",
              required: true,
              include: [
                {
                  model: Plan,
                  as: "plan"
                }
              ]
            }
          ]
        })
        if (session) {
          if (!checkScope(scope, session.scopes)) {
            res.status(401)
            res.json({
              errors: [
                {
                  name: "unauthScope",
                  message:
                    "You do not have permission to access this resource due to your current API key scopes.",
                  status: 401
                }
              ]
            })
            return
          }
          if (session.user?.banned) {
            res.sendStatus(401)
          } else {
            req["user"] = session.user
            next()
          }
        } else {
          res.status(401)
          res.json({
            errors: [
              {
                name: "noJWT",
                message:
                  "You must provide a token in the Authorization header.",
                status: 401
              }
            ]
          })
        }
      } else {
        console.log(69)
        res.status(401)
        res.json({
          errors: [
            {
              name: "noJWT",
              message: "You must provide a token in the Authorization header.",
              status: 401
            }
          ]
        })
      }
    } catch (err) {
      console.log(err)
      res.status(401)
      res.json({
        errors: [
          {
            name: "invalidJWT",
            message: "Your authorization token is invalid or has expired.",
            status: 401
          }
        ]
      })
    }
  }
}

export default auth
