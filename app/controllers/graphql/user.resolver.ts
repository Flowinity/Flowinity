import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
  Root
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
import { InfoParamMetadata } from "type-graphql/dist/metadata/definitions"
import { GraphQLResolveInfo } from "graphql/type"
import { Notification } from "@app/models/notification.model"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import { EXPECTED_OPTIONS_KEY, createContext } from "dataloader-sequelize"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { UpdateUserInput } from "@app/classes/graphql/user/updateUser"

@Resolver(User)
@Service()
export class UserResolver {
  constructor(private userUtilsService: UserUtilsService) {}

  @Authorized("user.view")
  @Query(() => User)
  async currentUser(@Ctx() ctx: Context) {
    return await this.findByPk(ctx.user!.id, ctx)
  }

  async findByPk(id: number, ctx: Context) {
    return await User.findByPk(id, {
      [EXPECTED_OPTIONS_KEY]: createContext(db),
      attributes: {
        include: ["alternatePasswords"]
      }
    })
  }

  @FieldResolver(() => [Badge])
  async badges(@Root() user: User) {
    return await user.$get("badges")
  }

  @FieldResolver(() => [Notification])
  async notifications(@Root() user: User, @Ctx() ctx: Context) {
    return await user.$get("notifications")
  }

  @FieldResolver(() => [Integration])
  async integrations(@Root() user: User, @Ctx() ctx: Context) {
    return await user.$get("integrations")
  }

  @FieldResolver(() => [Domain])
  async domain(@Root() user: User, @Ctx() ctx: Context) {
    return await user.$get("domain")
  }

  @FieldResolver(() => [Subscription])
  async subscription(@Root() user: User, @Ctx() ctx: Context) {
    return await user.$get("subscription")
  }

  @FieldResolver(() => Plan)
  async plan(@Root() user: User, @Ctx() ctx: Context) {
    return await user.$get("plan")
  }

  @FieldResolver(() => AutoCollectRule)
  async autoCollectRules(@Root() user: User, @Ctx() ctx: Context) {
    return await user.$get("autoCollectRules")
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
          attributes: [...partialUserBase, "itemsPerPage"]
        }
      ]
    })
  }

  @Authorized("user.modify")
  @Mutation(() => Boolean)
  async updateUser(@Arg("input") input: UpdateUserInput, @Ctx() ctx: Context) {
    await this.userUtilsService.updateUser(ctx.user!!.id, input)
    return true
  }
}
