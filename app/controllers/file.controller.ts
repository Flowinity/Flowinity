import { Request, Response, Router } from "express"
import { Service } from "typedi"
import Errors from "@app/lib/errors"
import { Upload } from "@app/models/upload.model"
import * as fs from "fs"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"

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
    this.router.get(
      "/:attachment",
      auth("user.view", true),
      async (req: RequestAuth, res: Response) => {
        try {
          const upload = await Upload.findOne({
            where: {
              attachment: req.params.attachment
            }
          })
          if (config.release === "dev") {
            try {
              await fs.accessSync(
                config.storage + "/" + req.params.attachment,
                fs.constants.F_OK
              )
            } catch {
              return res.redirect(
                "https://i.troplo.com/i/" + req.params.attachment
              )
            }
          }
          if (!upload) {
            throw Errors.NOT_FOUND
          }
          //Acropalypse temporary patch
          if (
            upload.userId === 1 &&
            upload.name.startsWith("Screenshot_2022") &&
            req.user?.id !== 1
          ) {
            return res.sendFile("/AuthRequired.png", {
              name: upload.originalFilename,
              root: config.storage + "/../../server/app/assets"
            })
          }
          if (req.query.force) {
            return res.download(
              config.storage + "/" + req.params.attachment,
              upload.originalFilename
            )
          }
          if (
            upload.type === "image" ||
            upload.type === "video" ||
            upload.type === "audio"
          ) {
            return res.sendFile("/" + upload.attachment, {
              root: config.storage,
              name: upload.originalFilename
            })
          } else {
            return res.download(
              config.storage + "/" + upload.attachment,
              upload.originalFilename
            )
          }
        } catch (err) {
          console.error(err)
          res.status(404)
          return res.json({
            errors: [
              {
                name: "NOT_FOUND",
                message: "The requested resource could not be found.",
                status: 404
              }
            ]
          })
        }
      }
    )
  }
}
