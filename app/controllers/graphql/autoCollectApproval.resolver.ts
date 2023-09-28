import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
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

@Resolver(AutoCollectApproval)
@Service()
export class AutoCollectApprovalResolver {
  constructor(private autoCollectService: AutoCollectService) {}

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

  @FieldResolver(() => Collection)
  async collection(@Root() autoCollectApproval: AutoCollectApproval) {
    return await autoCollectApproval.$get("collection")
  }

  @FieldResolver(() => Upload)
  async attachment(@Root() autoCollectApproval: AutoCollectApproval) {
    return await autoCollectApproval.$get("attachment")
  }
}