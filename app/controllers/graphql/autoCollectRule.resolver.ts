import { Arg, Ctx, Query, Resolver } from "type-graphql"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Service } from "typedi"
import { AutoCollectService } from "@app/services/autoCollect.service"
import { CacheService } from "@app/services/cache.service"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Context } from "@app/types/graphql/context"
import { AutoCollectRuleQueryInput } from "@app/classes/graphql/autoCollects/rules"
import { GraphQLError } from "graphql/error"

@Resolver(AutoCollectRule)
@Service()
export class AutoCollectRuleResolver {
  constructor(
    private autoCollectService: AutoCollectService,
    private cacheService: CacheService
  ) {}

  @Authorization({
    scopes: ["collections.view"]
  })
  @Query(() => [AutoCollectRule])
  async autoCollectRules(@Ctx() ctx: Context) {
    return await AutoCollectRule.findAll({
      where: {
        userId: ctx.user!!.id
      }
    })
  }

  @Authorization({
    scopes: ["collections.view"]
  })
  @Query(() => AutoCollectRule)
  async autoCollectRule(
    @Ctx() ctx: Context,
    @Arg("input") input: AutoCollectRuleQueryInput
  ) {
    return (
      (await AutoCollectRule.findOne({
        where: {
          id: input.id,
          userId: ctx.user!!.id
        }
      })) ?? new GraphQLError("AutoCollectRule not found")
    )
  }
}
