import {NextFunction, Response} from "express"
import {Service} from "typedi"
import auth from "@app/lib/auth"
import {RequestAuth} from "@app/types/express"
import Router from "express-promise-router"
import {CollectionService} from "@app/services/collection.service"
import {CollectionCache} from "@app/types/collection"
import Errors from "@app/lib/errors"
import {GalleryService} from "@app/services/gallery.service"
import {CacheService} from "@app/services/cache.service"
import {AdminService} from "@app/services/admin.service"
import uploader from "@app/lib/upload"
import rateLimits from "@app/lib/rateLimits"
import {CollectionItem} from "@app/models/collectionItem.model"

@Service()
export class CollectionController {
  router: any

  constructor(
    private readonly collectionService: CollectionService,
    private readonly galleryService: GalleryService,
    private readonly cacheService: CacheService,
    protected readonly adminService: AdminService
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
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          let collections = await this.collectionService.getCollectionsFilter(
            req.user.id,
            req.query?.type?.toString() || "all",
            req.query?.search?.toString() || ""
          )
          res.json(collections)
        } catch (e) {
          next(e)
        }
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
                "collection",
                12,
                <"">req.query.sort || "newest",
                !!req.query.array,
                0
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
            "collection",
            req.user.itemsPerPage,
            <"">req.query.sort || "newest",
            !!req.query.array,
            req.user.id
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
          const collectionItem = await CollectionItem.findOne({
            where: {
              collectionId: id,
              attachmentId: parseInt(req.params.attachmentId),
              userId: req.user.id
            }
          })
          if (!collectionItem) {
            throw Errors.COLLECTION_NO_PERMISSION
          }
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
        await this.cacheService.resetCollectionCache(id)
        res.sendStatus(204)
        await this.cacheService.generateCollectionCacheForUser(
          parseInt(req.params.id)
        )
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
        const user = await this.collectionService.addUserToCollection(
          id,
          req.user.id,
          req.body.username,
          req.body.write,
          req.body.configure,
          req.body.read
        )
        await this.cacheService.resetCollectionCache(id)
        res.json({
          ...user,
          user: {
            id: user.user.id,
            username: user.user.username
          }
        })
        /*await this.adminService.sendEmail(
          {
            body: {
              intro: `You are invited to ${user.collection.name} by ${req.user.username}`,
              action: [
                {
                  instructions: `TPU is a free invite-only image and file hosting service.`,
                  button: {
                    color: "#0190ea",
                    text: "Go to the collection",
                    link:
                      config.hostnameWithProtocol +
                      "/collection/" +
                      collection.id
                  }
                }
              ],
              outro:
                "You are receiving this as you are a user of TPU, and friend of the sender."
            }
          },
          user.user.email,
          `You have been invited to participate in ${user.collection.name}!`
        )*/
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
        if (
          !(await this.collectionService.getCollectionPermissions(
            req.body.id,
            req.user.id,
            "configure"
          ))
        )
          throw Errors.COLLECTION_NO_PERMISSION
        const collection = await this.collectionService.getCollectionOrShare(
          req.body.id,
          req.user.id
        )
        console.log("shareLinks:" + collection.shareLink)
        if (collection.shareLink)
          await redis.json.del("shareLinks:" + collection.shareLink)
        const update = await this.collectionService.updateShareLink(
          req.body.id,
          req.body.type
        )
        res.json(update)
        await this.cacheService.resetCollectionCache(req.body.id)
        if (update.shareLink)
          await this.cacheService.patchShareLinkCache(
            update.shareLink,
            collection.id
          )
      }
    )

    this.router.patch(
      "/:collectionId/pin/:attachmentId",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
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

          await this.collectionService.updatePin(
            parseInt(req.params.attachmentId),
            id
          )
          res.sendStatus(204)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.post(
      "/",
      auth("collections.create"),
      rateLimits.standardLimiter,
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const collection = await this.collectionService.createCollection(
            req.user.id,
            req.body.name
          )
          await this.cacheService.generateCollectionCacheForUser(req.user.id)
          res.json(collection)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.get(
      "/:collectionId/random",
      auth("collections.view", true),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const collection = await this.collectionService.getCollectionOrShare(
            parseInt(req.params.collectionId) || req.params.collectionId,
            req.user?.id
          )

          if (!collection) {
            throw Errors.COLLECTION_NOT_FOUND
          }

          res.json(
            await this.galleryService.getRandomAttachment(
              collection.id,
              "collection"
            )
          )
        } catch (e) {
          return next(e)
        }
      }
    )

    this.router.patch(
      "/:collectionId",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
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

          res.json(
            await this.collectionService.updateCollection(id, req.body.name)
          )
          await this.cacheService.resetCollectionCache(id)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.post(
      "/:collectionId/banner",
      auth("collections.modify"),
      rateLimits.uploadLimiterUser,
      uploader.single("banner"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
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
          const banner = await this.galleryService.createUpload(
            req.user.id,
            req.file,
            false,
            false
          )
          await this.collectionService.updateBanner(
            id,
            banner.upload.attachment
          )
          await this.cacheService.resetCollectionCache(id)
          res.json(banner)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.delete(
      "/:collectionId/banner",
      auth("collections.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
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
          await this.collectionService.updateBanner(id, null)
          await this.cacheService.resetCollectionCache(id)
          res.sendStatus(204)
        } catch (e) {
          next(e)
        }
      }
    )
  }
}
