import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Info,
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
import { InfoParamMetadata } from "type-graphql/dist/metadata/definitions"
import { GraphQLResolveInfo } from "graphql/type"
import { Notification } from "@app/models/notification.model"
import { CollectionService } from "@app/services/collection.service"
import { Collection } from "@app/models/collection.model"
import {
  CollectionCache,
  UserCollectionsInput
} from "@app/classes/graphql/collections/collections"

@Resolver(User)
@Service()
export class CollectionResolver {
  constructor(private collectionService: CollectionService) {}
  @Authorized("collections.view")
  @Query(() => [CollectionCache])
  async userCollections(
    @Ctx() ctx: Context,
    @Arg("input", { nullable: true }) input?: UserCollectionsInput
  ) {
    return await this.collectionService.getCollectionsFilter(
      ctx.user!!.id,
      input?.type || "all",
      input?.search || ""
    )
  }
}
