import { Service } from "typedi"

import Router from "express-promise-router"
import { AutoCollectService } from "@app/services/autoCollect.service"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import { Response } from "express"
import { GalleryService } from "@app/services/gallery.service"
import { CacheService } from "@app/services/cache.service"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import Errors from "@app/lib/errors"
import queue from "@app/lib/queue"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"

function currentEpoch() {
  return new Date().getTime()
}

@Service()
export class AutoCollectController {
  router: any

  constructor(
    private readonly autoCollectService: AutoCollectService,
    private readonly galleryService: GalleryService,
    private readonly cacheService: CacheService
  ) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.get(
      "/",
      auth("collections.view"),
      async (req: RequestAuth, res: Response) => {
        const autoCollects = await this.autoCollectService.getAutoCollects(
          req.user.id
        )
        res.json(autoCollects)
      }
    )

    this.router.get(
      "/rules",
      auth("collections.view"),
      async (req: RequestAuth, res: Response) => {
        const rules = await this.autoCollectService.getUserAutoCollectRules(
          req.user.id
        )
        res.json(rules)
      }
    )

    this.router.post(
      "/rules",
      auth("collections.create"),
      async (req: RequestAuth, res: Response) => {
        const rule = await AutoCollectRule.create({
          userId: req.user.id,
          name: req.body.name,
          enabled: req.body.enabled,
          collectionId: req.body.collectionId,
          requireApproval: req.body.requireApproval,
          rules: [
            {
              id: currentEpoch(),
              rules: [
                {
                  id: currentEpoch(),
                  type: "metadata",
                  value: "Change me",
                  operator: "contains"
                }
              ]
            }
          ]
        })
        res.json(rule)
      }
    )

    this.router.delete(
      "/rules/:id",
      auth("collections.create"),
      async (req: RequestAuth, res: Response) => {
        const rule = await AutoCollectRule.findOne({
          where: {
            id: req.params.id,
            userId: req.user.id
          }
        })
        if (!rule) throw Errors.COLLECTION_ITEM_NOT_FOUND
        await rule.destroy()
        res.sendStatus(204)
      }
    )

    this.router.put(
      "/rules/:id",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const rule = await AutoCollectRule.findOne({
          where: {
            id: req.params.id,
            userId: req.user.id
          }
        })
        if (!rule) throw Errors.COLLECTION_ITEM_NOT_FOUND
        await rule.update({
          name: req.body.name,
          enabled: req.body.enabled,
          collectionId: req.body.collectionId,
          requireApproval: req.body.requireApproval,
          rules: req.body.rules
        })
        res.json(rule)
      }
    )

    this.router.get(
      "/:id",
      auth("collections.view"),
      async (req: RequestAuth, res: Response) => {
        const gallery = await this.galleryService.getGallery(
          parseInt(req.params.id),
          parseInt(<string>req.query.page) || 1,
          req.query?.search?.toString(),
          req.query?.filter?.toString(),
          req.query?.textMetadata?.toString() === "true",
          "autoCollect",
          req.user.itemsPerPage,
          <"">req.query.sort || "newest",
          !!req.query.array,
          req.user.id
        )
        res.json(gallery)
      }
    )

    this.router.post(
      "/bulk",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const autoCollects = await AutoCollectApproval.findAll({
          where: {
            userId: req.user.id,
            id: req.body.ids
          }
        })

        for (const autoCollect of autoCollects) {
          await this.autoCollectService.actAutoCollect(
            req.user.id,
            autoCollect,
            req.body.action
          )
          await this.cacheService.patchAutoCollectCache(
            req.user.id,
            autoCollect.collectionId,
            autoCollect.id
          )
        }

        res.sendStatus(204)

        const collectionIds = Array.from(
          new Set(autoCollects.map((autoCollect) => autoCollect.collectionId))
        )
        for (const collectionId of collectionIds) {
          await queue.cacheQueue.add(String(collectionId), collectionId, {
            delay: 30000,
            jobId: collectionId + "-autoCollect"
          })
        }
      }
    )

    this.router.post(
      "/:id",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const autoCollect = await AutoCollectApproval.findOne({
          where: {
            userId: req.user.id,
            id: parseInt(req.params.id)
          }
        })

        if (!autoCollect) {
          throw Errors.COLLECTION_ITEM_NOT_FOUND
        }

        await this.autoCollectService.actAutoCollect(
          req.user.id,
          autoCollect,
          req.body.action
        )
        await this.cacheService.patchAutoCollectCache(
          req.user.id,
          autoCollect.collectionId,
          autoCollect.id
        )
        res.sendStatus(204)
        await queue.cacheQueue.add(
          String(autoCollect.collectionId),
          autoCollect.collectionId,
          {
            delay: 30000,
            jobId: autoCollect.collectionId + "-autoCollect"
          }
        )
      }
    )
  }
}
