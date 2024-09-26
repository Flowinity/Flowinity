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
import { Auth, authSystem } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { GalleryService } from "@app/services/gallery.service"
import rateLimits from "@app/lib/rateLimits"
import { SortOptions } from "@app/types/sort"
import uploader from "@app/lib/upload"
import { RequestAuth, RequestAuthSystem } from "@app/types/express"
import { OpenAPI } from "routing-controllers-openapi"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { pubSub } from "@app/lib/graphql/pubsub"
import { Upload } from "@app/models/upload.model"
import { NextFunction, Response } from "express"
import { AwsService } from "@app/services/aws.service"

async function checkUserQuota(
  req: RequestAuthSystem,
  res: Response,
  next: NextFunction
) {
  console.log(req.body)
  function e(error: keyof typeof Errors = "QUOTA_EXCEEDED", custom?: any) {
    return res.status(400).json({
      errors: [custom ? custom : { name: error, ...Errors[error] }]
    })
  }
  if (config.maintenance.enabled)
    e("UNKNOWN", {
      name: "MAINTENANCE",
      message: `${config.maintenance.message}\n\nFor more information visit ${config.maintenance.statusPage}`
    })
  await authSystem("uploads.create", true, req, res, () => {})
  if (!req.user) {
    return e("UNAUTHORIZED")
  }
  if (req.user.quota >= req.user.plan.quotaMax) {
    return e()
  }

  // Ensure the file isn't larger than the user's quota
  const size = parseInt(req.headers["content-length"] as string)
  if (size > req.user.plan.quotaMax - req.user.quota) {
    return e()
  }
  return next()
}

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
    @QueryParam("filter") filter: string = ""
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
    @QueryParam("filter") filter: string = ""
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
  @UseBefore(checkUserQuota)
  @UseBefore(rateLimits.uploadLimiter)
  async upload(
    @UploadedFile("attachment", {
      options: uploader
    })
    attachment: Express.Multer.File,
    @Req() req: RequestAuth
  ) {
    if (!attachment) throw Errors.NO_FILE
    const upload = await this.galleryService.createUpload(
      req.user.id,
      attachment,
      req.user.discordPrecache
    )
    pubSub.publish(`CREATE_UPLOADS:${req.user.id}`, [upload])
    socket.of(SocketNamespaces.GALLERY).to(req.user.id).emit("create", [upload])
    return upload
  }

  @Post("/upload")
  @OpenAPI({ deprecated: true, description: "Upload API for legacy clients" })
  @UseBefore(checkUserQuota)
  @UseBefore(rateLimits.uploadLimiter)
  async uploadLegacy(
    @UploadedFile("attachment", {
      options: uploader
    })
    attachment: Express.Multer.File,
    @Req() req: RequestAuth
  ) {
    return await this.upload(attachment, req)
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
  @UseBefore(checkUserQuota)
  @UseBefore(rateLimits.uploadLimiter)
  async uploadSite(
    @UploadedFiles("attachments", {
      options: uploader
    })
    attachments: Express.Multer.File[],
    @Req() req: RequestAuth
  ) {
    let files = []
    for (const attachment of attachments) {
      const upload = await this.galleryService.createUpload(
        req.user.id,
        attachment,
        false
      )

      files.push(upload)
      pubSub.publish(`CREATE_UPLOAD:${req.user.id}`, upload)
    }
    socket.of(SocketNamespaces.GALLERY).to(req.user.id).emit("create", files)
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
