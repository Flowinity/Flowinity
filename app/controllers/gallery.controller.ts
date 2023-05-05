import { NextFunction, Response, Request, Router } from "express"
import { Service } from "typedi"
import { StatusCodes } from "http-status-codes"
import { GalleryService } from "@app/services/gallery.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import uploader from "@app/lib/upload"
import Errors from "@app/lib/errors"
import rateLimits from "@app/lib/rateLimits"

@Service()
export class GalleryController {
  router: Router

  constructor(private readonly galleryService: GalleryService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    /**
     * @swagger
     *
     * /api/v2/gallery:
     *   get:
     *     summary: Return the current user's gallery.
     *     tags:
     *       - GalleryService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *       401:
     *         description: Unauthorized
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     *         - in: query
     *           name: page
     *           schema:
     *             type: integer
     *           description: The desired page number.
     *         - in: query
     *           name: search
     *           schema:
     *             type: string
     *           description: The search filter query.
     *         - in: query
     *           name: filter
     *           schema:
     *             type: string
     *             enum: ["all", "image", "video", "link", "binary", "text", "audio", "paste"]
     *           description: Filter the result by filetype.
     *         - in: query
     *           name: showMetadata
     *           schema:
     *             type: boolean
     *           description: Include search results from inside the image content from OCR text scanning.
     */
    this.router.get(
      "/",
      auth("uploads.view"),
      async (req: RequestAuth, res: Response) => {
        // Send the request to the service and send the response
        try {
          const gallery = await this.galleryService.getGallery(
            req.user.id,
            parseInt(<string>req.query.page) || 1,
            req.query?.search?.toString(),
            req.query?.filter?.toString(),
            req.query?.textMetadata?.toString() === "true",
            "user",
            req.user.itemsPerPage,
            <"">req.query.sort || "newest",
            !!req.query.array
          )
          res.json(gallery)
        } catch (e) {
          console.error(e)
          res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
      }
    )

    /**
     * @swagger
     *
     * /api/v2/gallery:
     *   post:
     *     summary: Upload a single file to TPU.
     *     tags:
     *       - GalleryService
     *     produces:
     *       - application/json
     *     consumes:
     *       - multipart/form-data
     *     responses:
     *       200:
     *         description: OK
     *       401:
     *         description: Unauthorized
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     *         - in: formData
     *           name: attachment
     *           type: file
     *           description: The file to upload to TPU.
     *           required: true
     */
    this.router.post(
      ["/", "/upload"],
      auth("uploads.create"),
      rateLimits.uploadLimiter,
      uploader.single("attachment"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          if (!req.file) throw Errors.NO_FILE
          const upload = await this.galleryService.createUpload(
            req.user.id,
            req.file,
            req.user.discordPrecache
          )
          socket.to(req.user.id).emit("gallery/create", upload)
          res.json(upload)
        } catch (e) {
          next(e)
        }
      }
    )

    /**
     * @swagger
     *
     * /api/v2/gallery/starred:
     *   get:
     *     description: Return the current user's starred gallery.
     *     tags:
     *       - GalleryService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *       401:
     *         description: Unauthorized
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     *         - in: query
     *           name: page
     *           schema:
     *             type: integer
     *           description: The desired page number.
     *         - in: query
     *           name: search
     *           schema:
     *             type: string
     *           description: The search filter query.
     *         - in: query
     *           name: filter
     *           schema:
     *             type: string
     *             enum: ["all", "image", "video", "link", "binary", "text", "audio", "paste"]
     *           description: Filter the result by filetype.
     *         - in: query
     *           name: showMetadata
     *           schema:
     *             type: boolean
     *           description: Include search results from inside the image content from OCR text scanning.
     */
    this.router.get(
      "/starred",
      auth(["starred.view", "uploads.view"]),
      async (req: RequestAuth, res: Response) => {
        // Send the request to the service and send the response
        try {
          const gallery = await this.galleryService.getGallery(
            req.user.id,
            parseInt(<string>req.query.page) || 1,
            req.query?.search?.toString(),
            req.query?.filter?.toString(),
            req.query?.textMetadata?.toString() === "true",
            "starred",
            req.user.itemsPerPage,
            <"">req.query.sort || "newest",
            !!req.query.array
          )
          res.json(gallery)
        } catch (e) {
          console.error(e)
          res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
      }
    )

    this.router.get(
      "/starred/random",
      auth(["starred.view", "uploads.view"]),
      async (req: RequestAuth, res: Response) => {
        try {
          const upload = await this.galleryService.getRandomAttachment(
            req.user.id,
            "starred"
          )
          res.json(upload)
        } catch (e) {
          console.error(e)
          res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
      }
    )

    this.router.post(
      "/site",
      auth("uploads.create"),
      rateLimits.uploadLimiter,
      uploader.array("attachments"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          let files = []
          if (!req?.files?.length) throw Errors.FILE_EXPECTED
          // @ts-ignore
          for (const upload of req.files) {
            files.push(
              await this.galleryService.createUpload(req.user.id, upload, false)
            )
          }
          socket.to(req.user.id).emit("gallery/create", files)
          res.json(files)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.delete(
      "/:id",
      auth("uploads.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          await this.galleryService.deleteUpload(
            parseInt(req.params.id),
            req.user.id
          )
          res.sendStatus(204)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.post(
      "/delete",
      auth("uploads.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          if (!req.body.items.length || req.body.items.length > 24) {
            throw Errors.TOO_MANY_ITEMS_DELETE
          }
          for (const id of req.body.items) {
            await this.galleryService.deleteUpload(parseInt(id), req.user.id)
          }
          res.sendStatus(204)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.get(
      "/random",
      auth("uploads.view"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const attachment = await this.galleryService.getRandomAttachment(
            req.user.id,
            "user"
          )
          res.json(attachment)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.post(
      "/star/:attachment",
      auth(["starred.modify", "uploads.modify"]),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          res.json({
            status: await this.galleryService.starUpload(
              req.params.attachment,
              req.user.id
            )
          })
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.get(
      "/:attachment",
      auth("user.view", true),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const attachment = await this.galleryService.getAttachment(
            req.params.attachment,
            req.user?.id
          )
          res.json(attachment)
        } catch (e) {
          next(e)
        }
      }
    )
  }
}
