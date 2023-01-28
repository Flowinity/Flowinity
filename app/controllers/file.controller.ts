import { Request, Response, Router } from "express"
import { Service } from "typedi"
import Errors from "@app/lib/errors"
import { Upload } from "@app/models/upload.model"

@Service()
export class FileController {
  router: Router

  constructor() {
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
    this.router.get("/:attachment", async (req: Request, res: Response) => {
      try {
        const upload = await Upload.findOne({
          where: {
            attachment: req.params.attachment
          }
        })
        if (!upload) {
          throw Errors.NOT_FOUND
        }
        if (req.query.force) {
          res.download(
            config.storage + "/" + upload.attachment,
            upload.originalFilename
          )
        }
        if (
          upload.type === "image" ||
          upload.type === "video" ||
          upload.type === "audio"
        ) {
          res.sendFile("/" + upload.attachment, {
            root: config.storage,
            name: upload.originalFilename
          })
        } else {
          res.download(
            config.storage + "/" + upload.attachment,
            upload.originalFilename
          )
        }
      } catch (err) {
        res.status(404)
        res.json({
          errors: [
            {
              name: "NOT_FOUND",
              message: "The requested resource could not be found.",
              status: 404
            }
          ]
        })
      }
    })
  }
}
