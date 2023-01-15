import { NextFunction, Response, Router } from "express"
import { Service } from "typedi"
import { StatusCodes } from "http-status-codes"
import { GalleryService } from "@app/services/gallery.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import uploader from "@app/lib/upload"
import Errors from "@app/lib/errors"

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
     *     description: Return the current user's gallery.
     *     tags:
     *       - GalleryService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.get(
      "/",
      auth("gallery.view"),
      async (req: RequestAuth, res: Response) => {
        // Send the request to the service and send the response
        try {
          const gallery = await this.galleryService.getGallery(
            req.user.id,
            parseInt(<string>req.query.page) || 1,
            req.query?.search?.toString(),
            req.query?.filter?.toString(),
            req.query?.textMetadata?.toString() === "true"
          )
          res.json(gallery)
        } catch (e) {
          console.error(e)
          res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
      }
    )

    this.router.post(
      "/",
      auth("gallery.create"),
      uploader.single("attachment"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const upload = await this.galleryService.createUpload(
            req.user.id,
            req.file
          )
          res.json(upload)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.post(
      "/site",
      auth("gallery.create"),
      uploader.array("attachments"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          let files = []
          if (!req?.files?.length) throw Errors.FILE_EXPECTED
          // @ts-ignore
          for (const upload of req.files) {
            files.push(
              await this.galleryService.createUpload(req.user.id, upload)
            )
          }
          res.json(files)
        } catch (e) {
          next(e)
        }
      }
    )
  }
}
