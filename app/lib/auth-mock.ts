import { Session } from "@app/models/session.model"
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"
import { Theme } from "@app/models/theme.model"
import { Domain } from "@app/models/domain.model"
import { Op } from "sequelize"
import { AsnResponse, CityResponse, Reader } from "maxmind"
import { Subscription } from "@app/models/subscription.model"
import { Experiment } from "@app/models/experiment.model"
import Errors from "@app/lib/errors"
import { Integration } from "@app/models/integration.model"

let asn: Reader<AsnResponse>
let city: Reader<CityResponse>

export async function authMock(
  userId: number,
  scope: string | string[],
  passthrough: boolean = false
) {
  console.log(userId, scope, passthrough)
  let session: Session | null = null
  try {
    session = await Session.findOne({
      where: {
        userId,
        scopes: "*",
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
            }
          ]
        }
      ]
    })
  } catch (e) {
    console.log(JSON.stringify(e))
  }
  if (session) {
    return session.user
  } else {
    if (passthrough) {
      return null
    }
    throw Errors.UNAUTHORIZED
  }
}
