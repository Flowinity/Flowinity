import { CollectionService } from "@app/services/collection.service"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Op } from "sequelize"
import { CollectionUser } from "@app/models/collectionUser.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"
import { Container, Service } from "typedi"
import { CoreService } from "@app/services/core.service"

@Service()
export class CacheService {
  async refreshState() {
    const start = new Date().getTime()
    console.info("[REDIS] Generating state cache...")
    const core = Container.get(CoreService)
    const state = await core.getState()
    redis.json.set("core:state", "$", {
      ...state,
      _redis: new Date().toISOString()
    })
    const end = new Date().getTime()
    console.info(`[REDIS] State cache generated in ${end - start}ms`)
    return state
  }

  async getCachedCollections(userId: number) {
    const collectionService = Container.get(CollectionService)
    if (await redis.json.get(`collections:${userId}`)) {
      return await redis.json.get(`collections:${userId}`)
    } else {
      this.generateCollectionCache().then(() => {})
      return await collectionService.getCollections(userId)
    }
  }

  async generateShareLinkCache() {
    console.info("[REDIS] Generating collections ShareLink cache...")
    const start = new Date().getTime()
    const collections = await Collection.findAll({
      where: {
        shareLink: {
          [Op.ne]: null
        }
      },
      include: [
        {
          model: CollectionUser,
          as: "users",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"]
            }
          ]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        },
        {
          model: CollectionItem,
          as: "preview",
          include: [
            {
              model: Upload,
              as: "attachment",
              attributes: ["id", "attachment"],
              where: {
                type: "image"
              }
            }
          ]
        }
      ]
    })
    for (const collection of collections) {
      redis.json.set(`shareLinks:${collection.shareLink}`, "$", collection)
    }
    const end = new Date().getTime()
    console.info(`[REDIS] Collections ShareLink cache generated in ${end - start}ms`)
  }

  async generateCollectionCache() {
    const collectionService = Container.get(CollectionService)
    console.info("[REDIS] Generating collections cache...")
    let start = new Date().getTime()
    const users = await User.findAll()
    for (const user of users) {
      const collections = await collectionService.getCollections(user.id)
      redis.json.set(`collections:${user.id}`, "$", collections)
    }
    let end = new Date().getTime()
    console.info(`[REDIS] Collections cache generated in ${end - start}ms`)
  }

  async generateCollectionCacheForUser(id: number) {
    const collectionService = Container.get(CollectionService)
    console.info("[REDIS] Generating collections cache for user...")
    let start = new Date().getTime()
    const collections = await collectionService.getCollections(id)
    redis.json.set(`collections:${id}`, "$", collections)
    let end = new Date().getTime()
    console.info(`[REDIS] User collections cache generated in ${end - start}ms`)
  }

  async resetCollectionCache(id: number) {
    const collectionService = Container.get(CollectionService)
    console.info("[REDIS] Generating collections cache for individual collection...")
    let start = new Date().getTime()
    const collection = await collectionService.getCollection(id)

    async function updateCache(user: CollectionUser) {
      const id = user.recipientId

      console.info("[REDIS] Patching cache for user", id)
      const collections = await redis.json.get(`collections:${id}`)
      const index: number = collections.findIndex((c: Collection) => c.id === collection.id)
      if (index === -1) {
        collections.push({
          ...collection.toJSON(),
          permissionsMetadata: {
            write: user.write,
            read: user.read,
            configure: user.configure
          }
        })
      } else {
        collections[index] = {
          ...collection.toJSON(),
          permissionsMetadata: {
            write: user.write,
            read: user.read,
            configure: user.configure
          }
        }
      }
      redis.json.set(`collections:${id}`, "$", collections)
    }

    for (const user of collection.users) {
      await updateCache(user)
    }

    await updateCache({
      recipientId: collection.userId,
      write: true,
      read: true,
      configure: true
    } as CollectionUser)

    let end = new Date().getTime()
    console.info(`[REDIS] Individual collection cache generated in ${end - start}ms`)
  }

  cacheInit() {
    // 10 minutes
    setInterval(this.refreshState, 1000 * 60 * 10)
    // 1 hour
    setInterval(this.generateCollectionCache, 3600000)
    setInterval(this.generateShareLinkCache, 3600000)

    this.refreshState().then(() => {})
    this.generateCollectionCache().then(() => {})
    this.generateShareLinkCache().then(() => {})
    return true
  }
}
