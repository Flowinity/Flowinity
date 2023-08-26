import {
  Arg,
  Authorized,
  Ctx,
  Field,
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
import { GraphQLResolveInfo } from "graphql/type"
import { Notification } from "@app/models/notification.model"
import { CollectionService } from "@app/services/collection.service"
import { Collection } from "@app/models/collection.model"
import {
  CollectionFilter,
  CollectionInput,
  UserCollectionsInput
} from "@app/classes/graphql/collections/collections"
import { CollectionUser } from "@app/models/collectionUser.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Upload } from "@app/models/upload.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { GraphQLError } from "graphql/error"
import { PagerResponse } from "@app/classes/graphql/gallery/galleryResponse"

export const PaginatedCollectionsResponse = PagerResponse(Collection)
export type PaginatedCollectionsResponse = InstanceType<
  typeof PaginatedCollectionsResponse
>

@Resolver(Collection)
@Service()
export class CollectionResolver {
  constructor(private collectionService: CollectionService) {}
  @Authorization({
    scopes: "collections.view",
    userOptional: true
  })
  @Query(() => PaginatedCollectionsResponse, {
    nullable: true
  })
  async collections(
    @Ctx() ctx: Context,
    @Arg("input", { nullable: true }) input?: UserCollectionsInput
  ): Promise<PaginatedCollectionsResponse | null> {
    if (!ctx.user) return null
    return (await this.collectionService.getCollectionsFilter(
      ctx.user!!.id,
      input?.filter || [CollectionFilter.ALL],
      input?.search || "",
      input?.page || 1,
      input?.limit || 24
    )) as PaginatedCollectionsResponse
  }

  @FieldResolver(() => [CollectionUser])
  async users(@Root() collection: Collection) {
    return await collection.$get("users")
  }

  @FieldResolver(() => PartialUserBase)
  async user(@Root() collection: Collection) {
    return await collection.$get("user", {
      attributes: partialUserBase
    })
  }

  @FieldResolver(() => [AutoCollectApproval])
  async autoCollectApprovals(@Root() collection: Collection) {
    return await collection.$get("autoCollectApprovals")
  }

  @FieldResolver(() => [Upload])
  async attachments(@Root() collection: Collection) {
    return []
  }

  @FieldResolver(() => Number)
  async itemCount(@Root() collection: Collection) {
    return await collection.$count("attachments")
  }

  @FieldResolver(() => CollectionUser)
  async recipient(@Root() collection: Collection) {
    return await collection.$get("recipient")
  }

  @Authorization({
    scopes: "collections.view",
    userOptional: true
  })
  @Query(() => Collection, {
    nullable: true
  })
  async collection(
    @Arg("input") { id, shareLink }: CollectionInput,
    @Ctx() ctx: Context
  ) {
    if (!id && !shareLink) throw new GraphQLError("No id or shareLink provided")
    const collection = await this.collectionService.getCollectionOrShare(
      id || shareLink,
      ctx.user?.id
    )
    if (!collection) return null
    return collection
  }
}

@Resolver(CollectionUser)
@Service()
export class CollectionUserResolver {
  constructor(private collectionService: CollectionService) {}

  @FieldResolver(() => PartialUserBase)
  async user(@Root() collectionUser: CollectionUser) {
    return await collectionUser.$get("user", {
      attributes: partialUserBase
    })
  }
}
