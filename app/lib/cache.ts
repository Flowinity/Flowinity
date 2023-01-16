import { CoreService } from "@app/services/core.service"
import { CollectionService } from "@app/services/collection.service"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Op } from "sequelize"
import { CollectionUser } from "@app/models/collectionUser.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"

export async function refreshState() {
  const start = new Date().getTime()
  console.info("[REDIS] Generating state cache...")
  let coreService: CoreService = new CoreService()
  const state = await coreService.getState()
  redis.json.set("core:state", "$", {
    ...state,
    _redis: new Date().toISOString()
  })
  const end = new Date().getTime()
  console.info(`[REDIS] State cached generated in ${end - start}ms`)
  return state
}

export async function generateShareLinkCache() {
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
  console.info(
    `[REDIS] Collections ShareLink cache generated in ${end - start}ms`
  )
}

export async function generateCollectionCache() {
  console.info("[REDIS] Generating collections cache...")
  let start = new Date().getTime()
  const users = await User.findAll()
  for (const user of users) {
    let collectionService: CollectionService = new CollectionService()
    const collections = await collectionService.getCollections(user.id)
    redis.json.set(`collections:${user.id}`, "$", collections)
  }
  let end = new Date().getTime()
  console.info(`[REDIS] Collections cache generated in ${end - start}ms`)
}

export async function generateCollectionCacheForUser(id: number) {
  console.info("[REDIS] Generating collections cache for user...")
  let start = new Date().getTime()
  let collectionService: CollectionService = new CollectionService()
  const collections = await collectionService.getCollections(id)
  redis.json.set(`collections:${id}`, "$", collections)
  let end = new Date().getTime()
  console.info(`[REDIS] User collections cache generated in ${end - start}ms`)
}

export function cacheInit() {
  // 10 minutes
  setInterval(refreshState, 600000)
  // 1 hour
  setInterval(generateCollectionCache, 3600000)
  setInterval(generateShareLinkCache, 3600000)

  refreshState().then(() => {})
  generateCollectionCache().then(() => {})
  generateShareLinkCache().then(() => {})
  return true
}

export default {
  cacheInit,
  refreshState,
  generateCollectionCache,
  generateShareLinkCache,
  generateCollectionCacheForUser
}
