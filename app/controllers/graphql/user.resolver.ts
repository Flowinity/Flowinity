import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql"
import { UserUtilsService } from "@app/services/userUtils.service"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Session } from "@app/models/session.model"
import { Op } from "sequelize"
import { Experiment } from "@app/models/experiment.model"
import { Subscription } from "@app/models/subscription.model"
import { Domain } from "@app/models/domain.model"
import { Plan } from "@app/models/plan.model"
import { Theme } from "@app/models/theme.model"
import { Integration } from "@app/models/integration.model"
import { Badge } from "@app/models/badge.model"
import { Includeable } from "sequelize"
import { Context } from "@app/types/graphql/context"

@Resolver(User)
@Service()
export class UserResolver {
  private readonly userIncludes: Includeable[]

  constructor(private userService: UserUtilsService) {
    this.userIncludes = [
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
    ]
  }

  @Authorized("user.view")
  @Query(() => User)
  async getUser(@Ctx() ctx: Context) {
    return await this.findByPk(ctx.user!.id)
  }

  async findByPk(id: number) {
    return await User.findByPk(id, {
      include: this.userIncludes,
      order: [
        [{ model: Badge, as: "badges" }, "priority", "DESC"],
        [{ model: Badge, as: "badges" }, "id", "ASC"]
      ]
    })
  }

  async findByToken(token: string | null) {
    return await Session.findOne({
      where: {
        token,
        expiredAt: {
          [Op.gt]: new Date()
        }
      },
      include: [
        {
          model: User,
          as: "user",
          required: true,
          attributes: ["id", "username", "administrator", "moderator"]
        }
      ]
    })
  }
}
