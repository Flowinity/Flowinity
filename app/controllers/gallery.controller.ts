import { Response, Router } from "express"
import { Service } from "typedi"
import { StatusCodes } from "http-status-codes"
import { GalleryService } from "@app/services/gallery.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import path from "path"
import multer from "multer"
import cryptoRandomString from "crypto-random-string"

const storage = multer.diskStorage({
  destination: process.env.STORAGE,
  filename: (req, file, cb) => {
    // path.extname = file extension
    cb(
      null,
      cryptoRandomString({ length: 12 }) + path.extname(file.originalname)
    )
  }
})

const uploader = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    cb(null, true)
  }
})

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
            parseInt(<string>req.query.page) || 1
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
      async (req: RequestAuth, res: Response) => {}
    )
  }
}
