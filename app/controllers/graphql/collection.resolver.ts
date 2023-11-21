import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
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
import { UpdateCollectionInput } from "@app/classes/graphql/collections/updateCollection"
import { GqlError } from "@app/lib/gqlErrors"
import { CacheService } from "@app/services/cache.service"
import { Success } from "@app/classes/graphql/generic/success"
import RateLimit from "@app/lib/graphql/RateLimit"
import {
  RemoveCollectionUserInput,
  UpdateCollectionUserPermissionsInput
} from "@app/classes/graphql/collections/collectionUsers"
import Errors from "@app/lib/errors"
import { CreateCollectionInput } from "@app/classes/graphql/collections/createCollection"

export const PaginatedCollectionsResponse = PagerResponse(Collection)
export type PaginatedCollectionsResponse = InstanceType<
  typeof PaginatedCollectionsResponse
>

@Resolver(Collection)
@Service()
export class CollectionResolver {
  constructor(
    private collectionService: CollectionService,
    private cacheService: CacheService
  ) {}
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
      input?.limit
    )) as PaginatedCollectionsResponse
  }

  @RateLimit({
    window: 5,
    max: 5
  })
  @Authorization({
    scopes: "collections.create"
  })
  @Mutation(() => Collection)
  async createCollection(
    @Ctx() ctx: Context,
    @Arg("input") input: CreateCollectionInput
  ) {
    const collection = await this.collectionService.createCollection(
      ctx.user!!.id,
      input.name
    )

    await this.cacheService.resetCollectionCache(collection.id)

    return collection
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

  @FieldResolver(() => String, {
    nullable: true
  })
  async banner(@Root() collection: Collection) {
    if (collection.image) return collection.image
    if (collection.preview?.attachment?.attachment)
      return collection.preview?.attachment?.attachment
    const preview = await collection.$get("preview", {
      attributes: ["attachmentId"],
      include: [
        {
          model: Upload,
          as: "attachment",
          attributes: ["attachment"],
          where: {
            type: "image"
          }
        }
      ]
    })
    if (preview?.attachment?.attachment) return preview?.attachment?.attachment
    return null
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

  @RateLimit({
    window: 12,
    max: 5
  })
  @Authorization({
    scopes: "collections.modify"
  })
  @Mutation(() => Collection)
  async updateCollection(
    @Arg("input") input: UpdateCollectionInput,
    @Ctx() ctx: Context
  ) {
    const permission = await this.collectionService.getCollectionPermissions(
      input.collectionId,
      ctx.user!!.id,
      "configure"
    )
    const collection = await Collection.findOne({
      where: {
        id: input.collectionId
      }
    })

    if (!permission || !collection) throw new GqlError("COLLECTION_NOT_FOUND")

    if (input.name) {
      await this.collectionService.updateCollection(
        input.collectionId,
        input.name
      )
    } else if (input.shareLink !== undefined) {
      if (collection.shareLink)
        await redis.json.del("shareLinks:" + collection.shareLink)

      const result = await this.collectionService.updateShareLink(
        input.collectionId,
        input.shareLink ? "link" : "nobody"
      )

      await this.cacheService.resetCollectionCache(input.collectionId)

      if (result.shareLink)
        await this.cacheService.patchShareLinkCache(
          result.shareLink,
          input.collectionId
        )
    }
    await this.cacheService.resetCollectionCache(input.collectionId)
    const collectionRes = await Collection.findOne({
      where: {
        id: input.collectionId
      }
    })
    return collectionRes?.toJSON()
  }
}

@Resolver(CollectionUser)
@Service()
export class CollectionUserResolver {
  constructor(
    private collectionService: CollectionService,
    private cacheService: CacheService
  ) {}

  @FieldResolver(() => PartialUserBase)
  async user(@Root() collectionUser: CollectionUser) {
    return await collectionUser.$get("user", {
      attributes: partialUserBase
    })
  }

  @RateLimit({
    window: 12,
    max: 12
  })
  @Authorization({
    scopes: "collections.modify"
  })
  @Mutation(() => CollectionUser)
  async updateCollectionUserPermissions(
    @Ctx() ctx: Context,
    @Arg("input") input: UpdateCollectionUserPermissionsInput
  ) {
    const collection = await this.collectionService.getCollectionPermissions(
      input.collectionId,
      ctx.user!!.id,
      "configure"
    )
    if (!collection) throw new GqlError("COLLECTION_NOT_FOUND")
    await this.collectionService.updateUser(
      input.collectionId,
      input.userId,
      input.write,
      input.configure,
      input.read
    )
    await this.cacheService.resetCollectionCache(input.collectionId)
    const res = await CollectionUser.findOne({
      where: {
        collectionId: input.collectionId,
        recipientId: input.userId
      }
    })
    return res?.toJSON()
  }

  @RateLimit({
    window: 12,
    max: 12
  })
  @Authorization({
    scopes: "collections.modify"
  })
  @Mutation(() => CollectionUser)
  async addCollectionUser(
    @Ctx() ctx: Context,
    @Arg("input") input: UpdateCollectionUserPermissionsInput
  ) {
    const collection = await this.collectionService.getCollectionPermissions(
      input.collectionId,
      ctx.user!!.id,
      "configure"
    )
    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    const collectionUser = await this.collectionService.addUserToCollection(
      input.collectionId,
      ctx.user!!.id,
      input.userId,
      input.write,
      input.configure,
      input.read,
      true
    )

    await this.cacheService.resetCollectionCache(input.collectionId)

    return collectionUser
  }

  @RateLimit({
    window: 12,
    max: 12
  })
  @Authorization({
    scopes: "collections.modify"
  })
  @Mutation(() => Success)
  async removeCollectionUser(
    @Ctx() ctx: Context,
    @Arg("input") input: RemoveCollectionUserInput
  ) {
    const collection = await this.collectionService.getCollectionPermissions(
      input.collectionId,
      ctx.user!!.id,
      "configure"
    )
    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    await this.collectionService.removeUserFromCollection(
      input.collectionId,
      input.userId
    )
    await this.cacheService.resetCollectionCache(
      input.collectionId,
      input.userId
    )
    return { success: true }
  }
}
