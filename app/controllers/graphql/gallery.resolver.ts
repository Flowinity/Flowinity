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
import { GraphQLResolveInfo, GraphQLScalarType } from "graphql/type"
import { Notification } from "@app/models/notification.model"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import { EXPECTED_OPTIONS_KEY, createContext } from "dataloader-sequelize"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { UpdateUserInput } from "@app/classes/graphql/user/updateUser"
import { Upload } from "@app/models/upload.model"
import { GalleryInput, Type } from "@app/classes/graphql/gallery/galleryInput"
import { Collection } from "@app/models/collection.model"
import { GalleryService } from "@app/services/gallery.service"
import { PaginatedGalleryResponse } from "@app/classes/graphql/gallery/galleryResponse"
import { CollectionItem } from "@app/models/collectionItem.model"
import { GraphQLError } from "graphql/error"
import { CollectionService } from "@app/services/collection.service"
import { Authorization } from "@app/lib/graphql/AuthChecker"
//@ts-ignore
import { resolver } from "graphql-sequelize"

const FileScalar = new GraphQLScalarType({
  name: "File",
  description: "File custom scalar type"
})

@Resolver(Upload)
@Service()
export class GalleryResolver {
  constructor(
    private galleryService: GalleryService,
    private userService: UserUtilsService,
    private collectionService: CollectionService
  ) {}

  @Authorization({
    scopes: ["uploads.view", "collections.view"],
    userOptional: true
  })
  @Query(() => PaginatedGalleryResponse)
  async gallery(
    @Ctx() ctx: Context,
    @Arg("input")
    input: GalleryInput
  ) {
    if (input.type === Type.COLLECTION) {
      if (!input.collectionId && !input.shareLink)
        throw new GraphQLError(
          "Collection ID or ShareLink is required for collection gallery"
        )
      const collection = await this.collectionService.getCollectionOrShare(
        input.collectionId || input.shareLink!!,
        ctx.user?.id
      )
      if (!collection)
        throw new GraphQLError(
          "You don't have permission to view this collection"
        )
      input.collectionId = collection.id
    } else if (!ctx.user) {
      throw new GraphQLError("You must be logged in to view the gallery")
    }
    return await this.galleryService.getGalleryV4(
      ctx.user?.id,
      input,
      ctx.user?.itemsPerPage || input.limit || 12,
      ctx.user?.id
        ? await this.userService.getAttribute(
            ctx.user.id,
            "excludedCollections"
          )
        : null
    )
  }

  @FieldResolver(() => Collection)
  async collections(@Root() upload: Upload) {
    return await upload.$get("collections")
  }

  @FieldResolver(() => User)
  async user(@Root() upload: Upload) {
    return await upload.$get("user")
  }

  @FieldResolver(() => CollectionItem)
  async items(@Root() upload: Upload) {
    return await upload.$get("items")
  }

  @Mutation(() => Upload)
  async upload(@Ctx() ctx: Context, @Arg("file", () => FileScalar) file: any) {
    console.log(file)
  }
}
