import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"
import { SlideshowService } from "@app/services/slideshow.service"
import { Slideshow } from "@app/models/slideshow.model"
import cryptoRandomString from "crypto-random-string"
import Errors from "@app/lib/errors"

@Service()
export class SlideshowController {
  router: any

  constructor(private readonly slideshowService: SlideshowService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.get(
      "/",
      auth("uploads.view"),
      async (req: RequestAuth, res: Response) => {
        const slideshows = await this.slideshowService.getSlideshows(
          req.user.id
        )
        res.json(slideshows)
      }
    )

    this.router.post(
      "/",
      auth("uploads.create"),
      async (req: RequestAuth, res: Response) => {
        const slideshow = await Slideshow.create({
          name: "New Slideshow",
          userId: req.user.id,
          shareLink: cryptoRandomString({ length: 128 }),
          collectionIds: [],
          includeGallery: false,
          speed: 5
        })

        res.json(slideshow)
      }
    )

    this.router.put(
      "/:id",
      auth("uploads.modify"),
      async (req: RequestAuth, res: Response) => {
        const slideshow = await Slideshow.findOne({
          where: {
            id: req.params.id,
            userId: req.user.id
          }
        })
        if (!slideshow) {
          throw Errors.SLIDESHOW_NOT_FOUND
        }

        // While the user may be able to supply any collection ID without validation, validation comes later when the slideshow is rendered to avoid exposure.
        await slideshow.update({
          name: req.body.name,
          collectionIds: req.body.collectionIds,
          includeGallery: req.body.includeGallery,
          speed: req.body.speed,
          scaling: req.body.scaling,
          showCaptions: req.body.showCaptions
        })
        res.json(slideshow)
      }
    )

    this.router.get("/:shareLink", async (req: RequestAuth, res: Response) => {
      res.json(
        await this.slideshowService.renderSlideshow(req.params.shareLink)
      )
    })

    this.router.get(
      "/:shareLink/config",
      async (req: RequestAuth, res: Response) => {
        res.json(
          await this.slideshowService.getSlideshowConfig(req.params.shareLink)
        )
      }
    )
  }
}
