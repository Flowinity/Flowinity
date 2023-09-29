import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import { CollectionService } from "@app/services/collection.service"
import { Collection } from "@app/models/collection.model"
import {
  CollectionFilter,
  CollectionInput,
  PermissionsMetadata,
  UserCollectionsInput
} from "@app/classes/graphql/collections/collections"
import { CollectionUser } from "@app/models/collectionUser.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Upload } from "@app/models/upload.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { GraphQLError } from "graphql/error"
import { PagerResponse } from "@app/classes/graphql/gallery/galleryResponse"
import { col } from "sequelize"

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

  @FieldResolver(() => Int)
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

  @FieldResolver(() => PermissionsMetadata)
  async permissionsMetadata(
    @Root() collection: Collection,
    @Ctx() ctx: Context
  ): Promise<PermissionsMetadata> {
    if (collection.permissionsMetadata) return collection.permissionsMetadata
    if (ctx.user!!.id === collection.userId)
      return {
        write: true,
        configure: true,
        read: true
      }
    const user = await collection.$get("recipient", {
      where: {
        recipientId: ctx.user!!.id
      }
    })
    if (user) {
      return {
        write: user.write,
        read: user.read,
        configure: user.configure
      }
    }
    return {
      write: false,
      configure: false,
      read: true
    }
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
