import { Response } from "express"
import { Service } from "typedi"
import auth from "@app/lib/auth"
import { RequestAuth } from "@app/types/express"
import Router from "express-promise-router"
import { CollectionService } from "@app/services/collection.service"
import { CollectionCache } from "@app/types/collection"
import Errors from "@app/lib/errors"
import { GalleryService } from "@app/services/gallery.service"
import { CacheService } from "@app/services/cache.service"

@Service()
export class CollectionController {
  router: any

  constructor(
    private readonly collectionService: CollectionService,
    private readonly galleryService: GalleryService,
    private readonly cacheService: CacheService
  ) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    /**
     * @swagger
     *
     * /api/v2/collections:
     *   get:
     *     description: Returns collections that the logged in user has access to.
     *     tags:
     *       - CollectionService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     */
    this.router.get(
      "/",
      auth("collections.view"),
      async (req: RequestAuth, res: Response) => {
        let collections = await this.collectionService.getCollectionsFilter(
          req.user.id,
          req.query?.type?.toString() || "all",
          req.query?.search?.toString() || ""
        )
        res.json(collections)
      }
    )

    /**
     * @swagger
     *
     * /api/v2/collections/:id:
     *   get:
     *     description: Returns the collection.
     *     tags:
     *       - CollectionService
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *     parameters:
     *         - in: header
     *           name: Authorization
     *           schema:
     *             type: string
     *             format: TPU-KEY
     *           required: true
     */
    this.router.get(
      "/:id",
      auth("collections.view", true),
      async (req: RequestAuth, res: Response) => {
        if (!req.user) {
          const collection = await redis.json.get(`shareLinks:${req.params.id}`)
          if (collection) {
            return res.json(collection)
          } else {
            throw Errors.COLLECTION_NOT_FOUND
          }
        }
        let collections = await this.cacheService.getCachedCollections(
          req.user.id
        )
        let collection = collections.find(
          (collection: CollectionCache) =>
            collection.id === parseInt(req.params.id) ||
            collection.shareLink === req.params.id
        )
        if (!collection) {
          throw Errors.COLLECTION_NOT_FOUND
        }
        return res.json(collection)
      }
    )

    this.router.get(
      "/:id/gallery",
      auth("collections.view", true),
      async (req: RequestAuth, res: Response) => {
        if (!req.user) {
          const collection = await redis.json.get(`shareLinks:${req.params.id}`)
          if (collection) {
            return res.json(
              await this.galleryService.getGallery(
                collection.id,
                parseInt(<string>req.query.page) || 1,
                req.query?.search?.toString(),
                req.query?.filter?.toString(),
                req.query?.textMetadata?.toString() === "true",
                "collection"
              )
            )
          } else {
            throw Errors.COLLECTION_NOT_FOUND
          }
        }
        let collections = await this.cacheService.getCachedCollections(
          req.user.id
        )
        let collection = collections.find(
          (collection: CollectionCache) =>
            collection.id === parseInt(req.params.id) ||
            collection.shareLink === req.params.id
        )
        if (!collection) {
          throw Errors.COLLECTION_NOT_FOUND
        }
        return res.json(
          await this.galleryService.getGallery(
            collection.id,
            parseInt(<string>req.query.page) || 1,
            req.query?.search?.toString(),
            req.query?.filter?.toString(),
            req.query?.textMetadata?.toString() === "true",
            "collection"
          )
        )
      }
    )

    this.router.post(
      "/attachment",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const collection =
          await this.collectionService.getCollectionPermissions(
            req.body.collectionId,
            req.user.id,
            "write"
          )
        if (!collection) {
          throw Errors.COLLECTION_NO_PERMISSION
        }
        const attachment = await this.collectionService.addToCollection(
          req.body.collectionId,
          req.body.attachmentId || req.body.items,
          req.user.id
        )
        res.json(attachment)
      }
    )

    this.router.delete(
      "/:collectionId/remove/:attachmentId",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const id = parseInt(req.params.collectionId)
        const collection =
          await this.collectionService.getCollectionPermissions(
            id,
            req.user.id,
            "configure"
          )
        if (!collection) {
          throw Errors.COLLECTION_NO_PERMISSION
        }
        await this.collectionService.removeFromCollection(
          id,
          parseInt(req.params.attachmentId)
        )
        res.sendStatus(204)
      }
    )

    this.router.delete(
      "/:collectionId/user/:id",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const id = parseInt(req.params.collectionId)
        const collection =
          await this.collectionService.getCollectionPermissions(
            id,
            req.user.id,
            "configure"
          )
        if (!collection) {
          throw Errors.COLLECTION_NO_PERMISSION
        }
        await this.collectionService.removeUserFromCollection(
          id,
          parseInt(req.params.id)
        )
        res.sendStatus(204)
        await this.cacheService.generateCollectionCacheForUser(
          parseInt(req.params.id)
        )
        await this.cacheService.resetCollectionCache(id)
      }
    )

    this.router.post(
      "/:collectionId/user",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const id = parseInt(req.params.collectionId)
        const collection =
          await this.collectionService.getCollectionPermissions(
            id,
            req.user.id,
            "configure"
          )
        if (!collection) {
          throw Errors.COLLECTION_NO_PERMISSION
        }
        await this.collectionService.addUserToCollection(
          id,
          req.user.id,
          req.body.username,
          req.body.write,
          req.body.configure,
          req.body.read
        )
        res.sendStatus(204)
        await this.cacheService.resetCollectionCache(id)
      }
    )

    this.router.patch(
      "/:collectionId/user",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const id = parseInt(req.params.collectionId)
        const collection =
          await this.collectionService.getCollectionPermissions(
            id,
            req.user.id,
            "configure"
          )
        if (!collection) {
          throw Errors.COLLECTION_NO_PERMISSION
        }
        await this.collectionService.updateUser(
          id,
          req.body.id,
          req.body.write,
          req.body.configure,
          req.body.read
        )
        res.sendStatus(204)
        await this.cacheService.resetCollectionCache(id)
      }
    )

    this.router.patch(
      "/share",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const collection =
          await this.collectionService.getCollectionPermissions(
            req.body.id,
            req.user.id,
            "configure"
          )
        if (!collection) {
          throw Errors.COLLECTION_NO_PERMISSION
        }
        res.json(
          await this.collectionService.updateShareLink(
            req.body.id,
            req.body.type
          )
        )
        await this.cacheService.resetCollectionCache(req.body.id)
        await this.cacheService.generateShareLinkCache()
      }
    )

    this.router.patch(
      "/:collectionId/pin/:attachmentId",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response) => {
        const id = parseInt(req.params.collectionId)
        const collection =
          await this.collectionService.getCollectionPermissions(
            id,
            req.user.id,
            "configure"
          )

        if (!collection) {
          throw Errors.COLLECTION_NO_PERMISSION
        }

        await this.collectionService.updatePin(id)
        res.sendStatus(204)
        await this.cacheService.resetCollectionCache(id)
      }
    )
  }
}
