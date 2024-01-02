import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription
} from "type-graphql"
import { Service } from "typedi"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { AutoCollectService } from "@app/services/autoCollect.service"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { PaginatedCollectionsResponse } from "@app/controllers/graphql/collection.resolver"
import { Context } from "@app/types/graphql/context"
import { Collection } from "@app/models/collection.model"
import { Upload } from "@app/models/upload.model"
import paginate from "jw-paginate"
import { UserCollectionsInput } from "@app/classes/graphql/collections/collections"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { ActOnAutoCollectsInput } from "@app/classes/graphql/autoCollects/actOnAutoCollectsInput"
import { CacheService } from "@app/services/cache.service"
import { Success } from "@app/classes/graphql/generic/success"
import { AutoCollectApprovalEvent } from "@app/classes/graphql/autoCollects/subscriptions/autoCollectApprovalEvent"

@Resolver(AutoCollectApproval)
@Service()
export class AutoCollectApprovalResolver {
  constructor(
    private autoCollectService: AutoCollectService,
    private cacheService: CacheService
  ) {}

  @Authorization({
    scopes: ["collections.view"]
  })
  @Query(() => PaginatedCollectionsResponse)
  async autoCollects(
    @Ctx() ctx: Context,
    @Arg("input") input: UserCollectionsInput
  ) {
    const autoCollects = await redis.json.get(`autoCollects:${ctx.user!!.id}`)
    const offset = input.page * input.limit - input.limit || 0
    const count = await AutoCollectApproval.count({
      where: {
        userId: ctx.user!!.id
      }
    })
    const pager = paginate(count, input.page, input.limit)
    if (autoCollects) {
      return {
        items: autoCollects.slice(offset, input.limit),
        pager
      } as PaginatedCollectionsResponse
    } else {
      const autoCollects = await Collection.findAll({
        offset,
        limit: input.limit,
        include: [
          {
            model: AutoCollectApproval,
            as: "autoCollectApprovals",
            where: {
              userId: ctx.user!!.id
            },
            required: true
          }
        ]
      })
      return {
        items: autoCollects,
        pager
      } as PaginatedCollectionsResponse
    }
  }

  @Authorization({
    scopes: ["collections.modify"]
  })
  @Mutation(() => Success)
  async actOnAutoCollects(
    @Ctx() ctx: Context,
    @Arg("input") input: ActOnAutoCollectsInput
  ) {
    const autoCollects = await AutoCollectApproval.findAll({
      where: {
        userId: ctx.user!!.id,
        id: input.items
      }
    })

    for (const autoCollect of autoCollects) {
      await this.autoCollectService.actAutoCollect(
        ctx.user!!.id,
        autoCollect,
        input.action
      )
      console.log(autoCollect.collectionId, autoCollect.id)
      await this.cacheService.patchAutoCollectCache(
        ctx.user!!.id,
        autoCollect.collectionId,
        autoCollect.id
      )
    }

    return { success: true }
  }

  @Authorization({
    scopes: ["collections.view"]
  })
  @Subscription(() => AutoCollectApprovalEvent, {
    topics: ({ context }) => {
      return `AUTO_COLLECT_APPROVAL:${context.user!!.id}`
    }
  })
  onAutoCollectApproval(@Root() autoCollectApproval: AutoCollectApprovalEvent) {
    return autoCollectApproval
  }

  @FieldResolver(() => Collection)
  async collection(@Root() autoCollectApproval: AutoCollectApproval) {
    return await autoCollectApproval.$get("collection")
  }

  @FieldResolver(() => Upload)
  async attachment(@Root() autoCollectApproval: AutoCollectApproval) {
    return await autoCollectApproval.$get("attachment")
  }

  @FieldResolver(() => AutoCollectRule)
  async autoCollectRule(@Root() autoCollectApproval: AutoCollectApproval) {
    return await autoCollectApproval.$get("autoCollectRule")
  }
}
