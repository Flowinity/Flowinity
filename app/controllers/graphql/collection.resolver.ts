import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription
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
  AcceptCollectionInviteInput,
  LeaveCollectionInput,
  RemoveCollectionUserInput,
  TransferCollectionOwnershipInput,
  UpdateCollectionUserPermissionsInput
} from "@app/classes/graphql/collections/collectionUsers"
import Errors from "@app/lib/errors"
import { CreateCollectionInput } from "@app/classes/graphql/collections/createCollection"
import paginate from "jw-paginate"
import { AuthService } from "@app/services/auth.service"
import { pubSub } from "@app/lib/graphql/pubsub"
import { FilterCollectionInput } from "@app/classes/graphql/collections/subscriptions/filterCollectionInput"

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
    if (input?.onlyInvited) {
      const collections = await this.collectionService.getCollections(
        ctx.user.id,
        true
      )
      return {
        items: collections,
        pager: paginate(collections.length, 1, 50)
      }
    }
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
      ],
      order: [["createdAt", "DESC"]]
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
    private cacheService: CacheService,
    private authService: AuthService
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

  @Authorization({
    scopes: "collections.view",
    userOptional: true
  })
  @Query(() => Int, {
    description:
      "Return the number of pending invitations for collections for the current user"
  })
  async collectionInvitesCount(@Ctx() ctx: Context) {
    if (!ctx.user) return 0
    return await CollectionUser.count({
      where: {
        recipientId: ctx.user.id,
        accepted: false
      }
    })
  }

  @Authorization({
    scopes: "collections.modify",
    userOptional: true
  })
  @Mutation(() => Success)
  async transferCollectionOwnership(
    @Ctx() ctx: Context,
    @Arg("input") input: TransferCollectionOwnershipInput
  ) {
    const collection = await Collection.findOne({
      where: {
        id: input.collectionId,
        userId: ctx.user?.id
      }
    })
    if (!collection) throw new GqlError("COLLECTION_NOT_FOUND")

    const collectionUser = await CollectionUser.findOne({
      where: {
        collectionId: input.collectionId,
        recipientId: input.userId,
        accepted: true
      }
    })

    if (!collectionUser)
      throw new GraphQLError("User is not in the collection.")

    await this.authService.validateAuthMethod({
      credentials: {
        password: input.password,
        totp: input.totp
      },
      userId: ctx.user!!.id,
      totp: !!input.totp,
      password: !!input.password,
      alternatePassword: false
    })

    const newUser = await CollectionUser.create({
      collectionId: input.collectionId,
      userId: ctx.user!!.id,
      read: true,
      write: true,
      configure: true,
      accepted: true
    })

    await collectionUser.destroy()

    await collection.update({
      userId: input.userId
    })

    this.collectionService.emitForAllPubSub(
      collection.id,
      `COLLECTION_UPDATED`,
      collection
    )
    this.collectionService.emitForAllPubSub(
      collection.id,
      `COLLECTION_USER_REMOVED`,
      collectionUser
    )
    this.collectionService.emitForAllPubSub(
      collection.id,
      `COLLECTION_USER_ADDED`,
      newUser
    )

    await this.cacheService.resetCollectionCache(input.collectionId)
    return { success: true }
  }

  @Authorization({
    scopes: "collections.modify"
  })
  @Mutation(() => Success)
  async actOnCollectionInvite(
    @Ctx() ctx: Context,
    @Arg("input") input: AcceptCollectionInviteInput
  ) {
    const collectionUser = await CollectionUser.findOne({
      where: {
        collectionId: input.collectionId,
        recipientId: ctx.user!!.id,
        accepted: false
      }
    })
    if (!collectionUser) throw new GqlError("COLLECTION_NOT_FOUND")
    if (!input.accept) {
      await collectionUser.destroy()
      this.collectionService.emitForAllPubSub(
        input.collectionId,
        "COLLECTION_USER_REMOVED",
        collectionUser
      )
      await this.cacheService.resetCollectionCache(input.collectionId)
      return { success: true }
    }
    await collectionUser.update({
      accepted: true
    })
    this.collectionService.emitForAllPubSub(
      input.collectionId,
      "COLLECTION_USER_UPDATED",
      collectionUser
    )
    pubSub.publish(
      `COLLECTION_CREATED:${ctx.user!!.id}`,
      await Collection.findOne({
        where: {
          id: input.collectionId
        }
      })
    )
    await this.cacheService.resetCollectionCache(input.collectionId)
    return { success: true }
  }

  @Authorization({
    scopes: "collections.modify"
  })
  @Mutation(() => Success)
  async leaveCollection(
    @Ctx() ctx: Context,
    @Arg("input") input: LeaveCollectionInput
  ) {
    const collectionUser = await CollectionUser.findOne({
      where: {
        collectionId: input.collectionId,
        recipientId: ctx.user!!.id
      }
    })
    if (!collectionUser) throw new GqlError("COLLECTION_NOT_FOUND")
    await collectionUser.destroy()
    await this.cacheService.resetCollectionCache(
      input.collectionId,
      ctx.user!!.id
    )
    this.collectionService.emitForAllPubSub(
      input.collectionId,
      "COLLECTION_USER_REMOVED",
      collectionUser
    )
    pubSub.publish(`COLLECTION_REMOVED:${ctx.user!!.id}`, input.collectionId)
    return { success: true }
  }

  @Authorization({
    scopes: "collections.view"
  })
  @Subscription(() => CollectionUser, {
    topics: ({ context }) => {
      return `COLLECTION_USER_ADDED:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      if (args.input) {
        if (args.input.collectionId !== payload.collectionId) return false
      }
      return true
    }
  })
  collectionUserAdded(
    @Root() collectionUser: CollectionUser,
    @Arg("input", {
      nullable: true
    })
    input: FilterCollectionInput
  ) {
    return collectionUser
  }

  @Authorization({
    scopes: "collections.view"
  })
  @Subscription(() => Collection, {
    topics: ({ context }) => {
      return `COLLECTION_UPDATED:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      if (args.input) {
        if (args.input.collectionId !== payload.id) return false
      }
      return true
    }
  })
  collectionUpdated(
    @Root() collection: Collection,
    @Arg("input", {
      nullable: true
    })
    input: FilterCollectionInput
  ) {
    return collection
  }

  @Authorization({
    scopes: "collections.view"
  })
  @Subscription(() => Int, {
    topics: ({ context }) => {
      return `COLLECTION_REMOVED:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      if (args.input) {
        if (args.input.collectionId !== payload.collectionId) return false
      }
      return true
    }
  })
  collectionRemoved(
    @Root() collectionId: number,
    @Arg("input", {
      nullable: true
    })
    input: FilterCollectionInput
  ) {
    return collectionId
  }

  @Authorization({
    scopes: "collections.view"
  })
  @Subscription(() => Collection, {
    topics: ({ context }) => {
      return `COLLECTION_CREATED:${context.user!!.id}`
    }
  })
  collectionCreated(@Root() collection: Collection) {
    return collection
  }

  @Authorization({
    scopes: "collections.view"
  })
  @Subscription(() => CollectionUser, {
    topics: ({ context }) => {
      return `COLLECTION_USER_REMOVED:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      if (args.input) {
        if (args.input.collectionId !== payload.collectionId) return false
      }
      return true
    }
  })
  collectionUserRemoved(
    @Root() collectionUser: CollectionUser,
    @Arg("input", {
      nullable: true
    })
    input: FilterCollectionInput
  ) {
    return collectionUser
  }

  @Authorization({
    scopes: "collections.view"
  })
  @Subscription(() => CollectionUser, {
    topics: ({ context }) => {
      return `COLLECTION_USER_UPDATED:${context.user!!.id}`
    },
    filter: ({ payload, args }) => {
      if (args.input) {
        if (args.input.collectionId !== payload.collectionId) return false
      }
      return true
    }
  })
  collectionUserUpdated(
    @Root() collectionUser: CollectionUser,
    @Arg("input", {
      nullable: true
    })
    input: FilterCollectionInput
  ) {
    return collectionUser
  }
}
