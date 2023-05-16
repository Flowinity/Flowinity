import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParam,
  Res,
  UploadedFile
} from "routing-controllers"
import { Response } from "express"
import { Service } from "typedi"
import JSZip from "jszip"
import fs from "fs"

// Import Libs
import { Auth } from "@app/lib/auth"
import Errors from "@app/lib/errors"
import uploader from "@app/lib/upload"

// Import Services
import { GalleryService } from "@app/services/gallery.service"
import { CacheService } from "@app/services/cache.service"
import { SortOptions } from "@app/types/sort"
import { CollectionService } from "@app/services/collection.service"
import { CollectionCache } from "@app/types/collection"

// Import Models
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionUser } from "@app/models/collectionUser.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"

@Service()
@JsonController("/collections")
export class CollectionControllerV3 {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly cacheService: CacheService,
    private readonly galleryService: GalleryService
  ) {}

  @Post("")
  async createCollection(
    @Auth("collections.create") user: User,
    @Body()
    body: {
      name: string
    }
  ): Promise<Collection> {
    const collection: Collection =
      await this.collectionService.createCollection(user.id, body.name)

    await this.cacheService.generateCollectionCacheForUser(user.id)

    return collection
  }

  @Get("")
  async getCollections(
    @Auth("collections.view") user: User,
    @QueryParam("type")
    type: "owned" | "shared" | "write" | "configure" | "all" = "all",
    @QueryParam("search") search: string = ""
  ): Promise<CollectionCache[]> {
    return await this.collectionService.getCollectionsFilter(
      user.id,
      type,
      search
    )
  }

  @Get("/:id")
  async getCollection(
    @Auth("collections.view", false) user: User,
    @Param("id") id: string
  ): Promise<any> {
    if (!user) {
      const collection = await redis.json.get(`shareLinks:${id}`)

      if (collection) return collection
      else throw Errors.COLLECTION_NOT_FOUND
    }

    let collections = await this.cacheService.getCachedCollections(user.id)
    let collection = collections.find(
      (collection: CollectionCache) =>
        collection.id === parseInt(id) || collection.shareLink === id
    )

    if (!collection) throw Errors.COLLECTION_NOT_FOUND

    return collection
  }

  @Get("/:id/gallery")
  async getCollectionGallery(
    @Auth("uploads.view", false) user: User,
    @QueryParam("page") page: number = 1,
    @QueryParam("sort") sort: SortOptions = "newest",
    @QueryParam("search") search: string = "",
    @QueryParam("array") array: boolean = false,
    @QueryParam("textMetadata") textMetadata: boolean = false,
    @QueryParam("filter") filter: string = "",
    @Param("id") id: string
  ): Promise<
    | any[]
    | {
        gallery: any[]
        pager: {
          totalItems: number
          currentPage: number
          pageSize: number
          totalPages: number
          startPage: number
          endPage: number
          startIndex: number
          endIndex: number
          pages: number[]
        }
      }
  > {
    const collection = await this.getCollection(user, id)

    if (!collection) throw Errors.COLLECTION_NOT_FOUND

    return await this.galleryService.getGallery(
      collection.id,
      page,
      search,
      filter,
      textMetadata,
      "collection",
      user.itemsPerPage,
      sort,
      array,
      user.id,
      user.excludedCollections
    )
  }

  @Post("/attachment")
  async addAttachmentToCollection(
    @Auth("collections.modify") user: User,
    @Body()
    body: { collectionId: number; attachmentId?: number; items: number[] }
  ): Promise<CollectionItem | CollectionItem[]> {
    const collection = await this.collectionService.getCollectionPermissions(
      body.collectionId,
      user.id,
      "write"
    )

    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    return await this.collectionService.addToCollection(
      body.collectionId,
      body.attachmentId || body.items,
      user.id
    )
  }

  @Delete("/:collectionId/remove/:attachmentId")
  async removeAttachmentFromCollection(
    @Auth("collections.modify") user: User,
    @Param("collectionId") collectionId: number,
    @Param("attachmentId") attachmentId: number
  ): Promise<void> {
    const collection = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "configure"
    )

    if (!collection) {
      const collectionItem: CollectionItem | null =
        await CollectionItem.findOne({
          where: {
            collectionId: collectionId,
            attachmentId: attachmentId,
            userId: user.id
          }
        })

      if (!collectionItem) throw Errors.COLLECTION_NO_PERMISSION
    }

    await this.collectionService.removeFromCollection(
      collectionId,
      attachmentId
    )
  }

  @Post("/:collectionId/user")
  async addUserToCollection(
    @Auth("collections.modify") user: User,
    @Param("collectionId") collectionId: number,
    @Body()
    body: {
      username: string
      write: boolean
      configure: boolean
      read: boolean
    }
  ): Promise<{ user: { id: number; username: string } }> {
    const collection = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "configure"
    )
    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    const collectionUser = await this.collectionService.addUserToCollection(
      collectionId,
      user.id,
      body.username,
      body.write,
      body.configure,
      body.read
    )

    await this.cacheService.resetCollectionCache(collectionId)

    return {
      ...user,
      user: {
        id: collectionUser.user.id,
        username: collectionUser.user.username
      }
    }
  }

  @Patch("/:collectionId/user")
  async updateUserPermissions(
    @Auth("collections.modify") user: User,
    @Param("collectionId") collectionId: number,
    @Body()
    body: {
      id: number
      write: boolean
      configure: boolean
      read: boolean
    }
  ): Promise<void> {
    const collection = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "configure"
    )
    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    const collectionUser: [affectedCount: number] =
      await this.collectionService.updateUser(
        collectionId,
        user.id,
        body.write,
        body.configure,
        body.read
      )

    await this.cacheService.resetCollectionCache(collectionId)

    // Should this return something?
  }

  @Patch("/share")
  async updateShareLink(
    @Auth("collections.modify") user: User,
    @Body()
    body: {
      id: number
      type: "link" | "nobody"
    }
  ): Promise<{ shareLink: string } | { shareLink: null }> {
    if (
      !(await this.collectionService.getCollectionPermissions(
        body.id,
        user.id,
        "configure"
      ))
    )
      throw Errors.COLLECTION_NO_PERMISSION
    const collection = await this.collectionService.getCollectionOrShare(
      body.id,
      user.id
    )
    if (collection.shareLink)
      await redis.json.del("shareLinks:" + collection.shareLink)

    const result: { shareLink: string } | { shareLink: null } =
      await this.collectionService.updateShareLink(body.id, body.type)

    await this.cacheService.resetCollectionCache(body.id)

    if (result.shareLink)
      await this.cacheService.patchShareLinkCache(
        result.shareLink,
        collection.id
      )

    return result
  }

  @Patch("/:collectionId/pin/:attachmentId")
  async pinAttachment(
    @Auth("collections.modify") user: User,
    @Param("collectionId") collectionId: number,
    @Param("attachmentId") attachmentId: number
  ): Promise<void> {
    const collection = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "configure"
    )

    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    await this.collectionService.updatePin(attachmentId, collectionId)
  }

  @Get("/:collectionId/random")
  async getRandomAttachment(
    @Auth("collections.view", false) user: User,
    @Param("collectionId") collectionId: string
  ): Promise<Upload> {
    const collection = await this.collectionService.getCollectionOrShare(
      parseInt(collectionId) || collectionId,
      user.id
    )

    if (!collection) throw Errors.COLLECTION_NOT_FOUND

    return await this.galleryService.getRandomAttachment(
      collection.id,
      "collection"
    )
  }

  @Patch("/:collectionId")
  async updateCollection(
    @Auth("collections.modify") user: User,
    @Param("collectionId") collectionId: number,
    @Body()
    body: {
      name: string
    }
  ): Promise<{ name: string }> {
    const collection = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "configure"
    )

    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    await this.cacheService.resetCollectionCache(collectionId)

    return await this.collectionService.updateCollection(
      collectionId,
      body.name
    )
  }

  @Post("/:collectionId/banner")
  async updateBanner(
    @Auth("collections.modify") user: User,
    @Param("collectionId") collectionId: number,
    @UploadedFile("banner", {
      options: uploader
    })
    banner: Express.Multer.File
  ): Promise<{ upload: Upload; url: string }> {
    const collection = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "configure"
    )

    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    const ban: { upload: Upload; url: string } =
      await this.galleryService.createUpload(user.id, banner, false, false)

    await this.collectionService.updateBanner(
      collectionId,
      ban.upload.attachment
    )
    await this.cacheService.resetCollectionCache(collectionId)

    return ban
  }

  @Delete("/:collectionId/banner")
  async deleteBanner(
    @Auth("collections.modify") user: User,
    @Param("collectionId") collectionId: number
  ): Promise<void> {
    const collection = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "configure"
    )

    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    await this.collectionService.updateBanner(collectionId, null)
    await this.cacheService.resetCollectionCache(collectionId)
  }

  @Delete("/:collectionId")
  async deleteCollection(
    @Auth("*") user: User,
    @Param("collectionId") collectionId: number
  ) {
    const permission = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "owner"
    )

    if (!permission) throw Errors.COLLECTION_NO_PERMISSION

    const collection: Collection = await this.collectionService.getCollection(
      collectionId
    )

    await Collection.destroy({
      where: {
        id: collectionId,
        userId: user.id
      }
    })
    await CollectionItem.destroy({
      where: {
        collectionId
      }
    })
    await CollectionUser.destroy({
      where: {
        collectionId
      }
    })

    for (const user of collection.users) {
      await this.cacheService.generateCollectionCache(user.id)
    }
  }

  @Get("/:collectionId/download")
  async downloadCollection(
    @Auth("collections.view") user: User,
    @Param("collectionId") collectionId: number,
    @Res() res: Response
  ) {
    const collection = await this.collectionService.getCollectionPermissions(
      collectionId,
      user.id,
      "configure"
    )

    if (!collection) throw Errors.COLLECTION_NO_PERMISSION

    const attachments: Upload[] =
      await this.galleryService.getAttachmentsByCollectionId(collectionId)

    if (attachments.length > 0) {
      const zip: JSZip = new JSZip()
      const size: number = attachments.reduce(
        (acc: number, file: Upload) => acc + file.fileSize,
        0
      )

      if (size > 10737418240) throw Errors.COLLECTION_TOO_BIG_TO_DOWNLOAD

      for (let attachment of attachments) {
        attachment = await this.galleryService.getAttachment(
          attachment.attachment,
          attachment.userId
        )

        const file: Buffer = fs.readFileSync(
          `${config.storage}/${attachment.attachment}`
        )

        if (!file) throw new Error("Couldn't archive collection.")

        zip.file(
          `${attachment.originalFilename.split(".")[0]}.${
            attachment.attachment
          }`,
          file
        )
      }

      const buffer: Buffer = await zip.generateAsync({ type: "nodebuffer" })

      return res.send(buffer)
    } else {
      throw Errors.COLLECTION_EMPTY_TO_DOWNLOAD
    }
  }
}
