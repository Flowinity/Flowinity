import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from "type-graphql"
import { Collection } from "@app/models/collection.model"
import { Service } from "typedi"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Context } from "@app/types/graphql/context"
import { AddToCollectionInput } from "@app/classes/graphql/collections/addToCollection"
import { CollectionService } from "@app/services/collection.service"
import { GqlError } from "@app/lib/gqlErrors"
import { Upload } from "@app/models/upload.model"
import Errors from "@app/lib/errors"
import { Success } from "@app/classes/graphql/generic/success"

@Resolver(CollectionItem)
@Service()
export class CollectionItemResolver {
  constructor(private collectionService: CollectionService) {}

  @FieldResolver(() => Collection)
  async collection(@Root() collectionItem: CollectionItem) {
    return await collectionItem.$get("collection")
  }

  @Authorization({
    scopes: "collections.modify"
  })
  @Mutation(() => [CollectionItem])
  async addToCollection(
    @Ctx() ctx: Context,
    @Arg("input") input: AddToCollectionInput
  ) {
    const collection = await this.collectionService.getCollectionPermissions(
      input.collectionId,
      ctx.user!!.id,
      "write"
    )
    if (!collection) throw new GqlError("COLLECTION_NOT_FOUND")
    const uploads = await Upload.findAll({
      where: {
        id: input.items,
        userId: ctx.user!!.id
      }
    })
    if (uploads.length === 0 || uploads.length !== input.items?.length)
      throw new GqlError("ATTACHMENT_NOT_FOUND")
    return await this.collectionService.addToCollection(
      input.collectionId,
      uploads.map((attachment) => attachment.id),
      ctx.user!!.id
    )
  }

  @Authorization({
    scopes: "collections.modify"
  })
  @Mutation(() => Success)
  async removeFromCollection(
    @Ctx() ctx: Context,
    @Arg("input") input: AddToCollectionInput
  ): Promise<Success> {
    const collection = await this.collectionService.getCollectionPermissions(
      input.collectionId,
      ctx.user!!.id,
      "configure"
    )
    if (!collection) {
      const items = await CollectionItem.findAll({
        where: {
          collectionId: input.collectionId,
          attachmentId: input.items,
          userId: ctx.user!!.id
        }
      })

      if (!items.length) throw new GqlError("ATTACHMENT_NOT_FOUND")
      await CollectionItem.destroy({
        where: {
          collectionId: input.collectionId,
          attachmentId: input.items,
          userId: ctx.user!!.id
        }
      })
      this.collectionService.emitUpdate(
        items.map((item) => item.attachmentId),
        ctx.user!!.id
      )
      return { success: true }
    }
    await this.collectionService.removeFromCollection(
      input.collectionId,
      input.items,
      ctx.user!!.id
    )
    return { success: true }
  }
}
