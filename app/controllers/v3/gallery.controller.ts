import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseBefore
} from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { GalleryService } from "@app/services/gallery.service"
import rateLimits from "@app/lib/rateLimits"
import { SortOptions } from "@app/types/sort"
import uploader from "@app/lib/upload"
import { RequestAuth } from "@app/types/express"
import { OpenAPI } from "routing-controllers-openapi"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { pubSub } from "@app/lib/graphql/pubsub"
import { Upload } from "@app/models/upload.model"
import { Response } from "express"

@Service()
@JsonController("/gallery")
export class GalleryControllerV3 {
  constructor(private readonly galleryService: GalleryService) {}

  @Get("")
  async getUserGallery(
    @Auth("uploads.view") user: User,
    @QueryParam("page") page: number = 1,
    @QueryParam("sort") sort: SortOptions = "newest",
    @QueryParam("search") search: string = "",
    @QueryParam("array") array: boolean = false,
    @QueryParam("textMetadata") textMetadata: boolean = false,
    @QueryParam("filter") filter: string = "",
    @Req() req: RequestAuth
  ) {
    return await this.galleryService.getGallery(
      user.id,
      page,
      search,
      filter,
      textMetadata,
      "user",
      user.itemsPerPage,
      sort,
      array,
      undefined,
      user.excludedCollections
    )
  }

  @Get("/starred")
  async getStarredGallery(
    @Auth("starred.view") user: User,
    @QueryParam("page") page: number = 1,
    @QueryParam("sort") sort: SortOptions = "newest",
    @QueryParam("search") search: string = "",
    @QueryParam("array") array: boolean = false,
    @QueryParam("textMetadata") textMetadata: boolean = false,
    @QueryParam("filter") filter: string = "",
    @Req() req: RequestAuth
  ) {
    return await this.galleryService.getGallery(
      user.id,
      page,
      search,
      filter,
      textMetadata,
      "starred",
      user.itemsPerPage,
      sort,
      array,
      undefined,
      user.excludedCollections
    )
  }

  @Post("")
  @UseBefore(rateLimits.uploadLimiter)
  async upload(
    @Auth("uploads.create") user: User,
    @UploadedFile("attachment", {
      options: uploader
    })
    attachment: Express.Multer.File,
    @Req() req: Request
  ) {
    if (!attachment) throw Errors.NO_FILE
    const upload = await this.galleryService.createUpload(
      user.id,
      attachment,
      user.discordPrecache
    )
    pubSub.publish(`CREATE_UPLOADS:${user.id}`, [upload])
    socket.of(SocketNamespaces.GALLERY).to(user.id).emit("create", [upload])
    return upload
  }

  @Post("/upload")
  @OpenAPI({ deprecated: true, description: "Upload API for legacy clients" })
  @UseBefore(rateLimits.uploadLimiter)
  async uploadLegacy(
    @Auth("uploads.create") user: User,
    @UploadedFile("attachment", {
      options: uploader
    })
    attachment: Express.Multer.File,
    @Req() req: Request
  ) {
    return await this.upload(user, attachment, req)
  }

  @Get("/starred/random")
  async getRandomStarred(@Auth("uploads.view") user: User) {
    return await this.galleryService.getRandomAttachment(user.id, "starred")
  }

  @Get("/random")
  async getRandom(@Auth("uploads.view") user: User) {
    return await this.galleryService.getRandomAttachment(user.id, "user")
  }

  @Post("/site")
  @UseBefore(rateLimits.uploadLimiter)
  async uploadSite(
    @Auth("uploads.create") user: User,
    @UploadedFiles("attachments", {
      options: uploader
    })
    attachments: Express.Multer.File[]
  ) {
    let files = []
    for (const attachment of attachments) {
      const upload = await this.galleryService.createUpload(
        user.id,
        attachment,
        false
      )

      files.push(upload)
      pubSub.publish(`CREATE_UPLOAD:${user.id}`, upload)
    }
    socket.of(SocketNamespaces.GALLERY).to(user.id).emit("create", files)
    return files
  }

  @Delete("/:id")
  async deleteUpload(
    @Auth("uploads.modify") user: User,
    @Param("id") id: number
  ) {
    await this.galleryService.deleteUpload(id, user.id)
  }

  // bulk delete
  @Post("/delete")
  async deleteUploads(
    @Auth("uploads.modify") user: User,
    @Body() body: { items: number[] }
  ) {
    if (!body.items.length || body.items.length > 24) {
      throw Errors.TOO_MANY_ITEMS_DELETE
    }
    for (const id of body.items) {
      await this.galleryService.deleteUpload(id, user.id)
    }
  }

  @Post("/star/:attachment")
  async starUpload(
    @Auth("uploads.modify") user: User,
    @Param("attachment") attachment: string
  ) {
    return await this.galleryService.starUpload(attachment, user.id)
  }

  @Get("/:attachment")
  async getUpload(
    @Auth("uploads.view", false) user: User,
    @Param("attachment") attachment: string
  ) {
    return await this.galleryService.getAttachment(attachment, user?.id)
  }

  @Post("/download")
  @UseBefore(rateLimits.downloadZipFileExportLimiter)
  async downloadUploads(
    @Auth("uploads.view") user: User,
    @Body() body: { items: string[]; shareLink?: string },
    @Res() res: Response
  ) {
    if (!body.items.length || body.items.length > 24) {
      throw Errors.TOO_MANY_ITEMS_DOWNLOAD
    }
    const attachments = await Upload.findAll({
      where: {
        attachment: body.items
      }
    })

    return await this.galleryService.downloadAttachments(attachments, res)
  }

  /*
  @Post("/download")
  async downloadUploads(
    @Auth("uploads.view") user: User,
    @Body() body: { items: number[]; shareLink?: string },
    @Res() res: Response
  ) {
    if (!body.items.length || body.items.length > 24) {
      throw Errors.TOO_MANY_ITEMS_DOWNLOAD
    }
    const attachments = await Upload.findAll({
      where: {
        id: body.items
      },
      include: [
        {
          model: Collection,
          as: "collections",
          include: [
            {
              model: CollectionUser,
              as: "recipient",
              attributes: ["recipientId"],
              where: {
                recipientId: user.id,
                read: true
              },
              required: false
            }
          ],
          required: false
        }
      ]
    })

    console.log(attachments)
    // ensure that either the user owns the upload or the upload is in a collection they own, download what's possible
    const filteredAttachments = attachments.filter(
      (attachment) =>
        attachment.userId === user.id ||
        attachment.collections.some(
          (collection) =>
            collection.recipient?.recipientId === user.id ||
            collection.userId === user.id ||
            collection.shareLink === body.shareLink
        )
    )

    return await this.galleryService.downloadAttachments(
      filteredAttachments,
      res
    )
  }*/
}
