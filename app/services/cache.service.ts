import { CollectionService } from "@app/services/collection.service"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Op } from "sequelize"
import { CollectionUser } from "@app/models/collectionUser.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"
import { Container, Service } from "typedi"
import { CoreService } from "@app/services/core.service"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { PulseService } from "@app/services/pulse.service"
import { ChatService } from "@app/services/chat.service"
import { Chat } from "@app/models/chat.model"
import { Message } from "@app/models/message.model"
import cron from "node-cron"

@Service()
export class CacheService {
  async generateMissingChatDates() {
    console.info("[REDIS] Generating missing chat date keys...")
    const chats = await Chat.findAll()
    let start = new Date().getTime()
    for (const chat of chats) {
      const sortDate = await redis.get(`chat:${chat.id}:sortDate`)
      if (!sortDate) {
        const lastMessage = await Message.findOne({
          where: { chatId: chat.id },
          order: [["createdAt", "DESC"]]
        })
        if (lastMessage) {
          await redis.int.set(
            `chat:${chat.id}:sortDate`,
            dayjs(lastMessage.createdAt).valueOf()
          )
        }
      }
    }
    let end = new Date().getTime()
    console.info(`[REDIS] Missing chat date keys generated in ${end - start}ms`)
  }
  async patchChatsCacheForUser(userId: number, chat: Chat) {
    let chats = await redis.json.get(`chats:${userId}`)
    if (!chats?.length) {
      return await this.generateChatsCache(userId)
    }
    const existingChat = chats.find((c: Chat) => c.id === chat.id)
    if (existingChat) {
      chats[chats.indexOf(existingChat)] = chat
    } else {
      chats.push(chat)
    }
    redis.json.set(`chats:${userId}`, "$", chats)
  }

  async generateChatsCache(userId?: number) {
    try {
      console.info("[REDIS] Generating chats cache...")
      let start = new Date().getTime()
      let users = []
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })]
      }
      const chatService = Container.get(ChatService)
      for (const user of users) {
        if (!user) continue
        const chats = await chatService.getUserChats(user.id)
        redis.json.set(`chats:${user.id}`, "$", chats)
      }
      let end = new Date().getTime()
      console.info(`[REDIS] Chats cache generated in ${end - start}ms`)
    } catch (e) {
      console.error(e)
    }
  }
  async generateUserStatsCache(userId?: number) {
    try {
      console.info("[REDIS] Generating user stats cache...")
      let start = new Date().getTime()
      const coreService = Container.get(CoreService)
      let users
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })] as User[]
      }
      for (const user of users) {
        const result = await coreService.getStats(user)
        redis.json.set(`userStats:${user.id}`, "$", result)
      }
      let end = new Date().getTime()
      console.info(`[REDIS] User stats cache generated in ${end - start}ms`)
    } catch {}
  }

  async generateInsightsCache(userId?: number) {
    try {
      const pulseService = Container.get(PulseService)
      console.info("[REDIS] Generating insights cache...")
      // Leaderboard
      const leaderboard = await pulseService.getLeaderboard()
      redis.json.set(`insights:leaderboard`, "$", leaderboard)
      // Insights
      const start = new Date().getTime()
      let users
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })] as User[]
      }
      const years = ["2021", "2022", "2023", "latest"]
      for (const user of users) {
        let result = {}
        for (const year of years) {
          result[year] = {
            ...(await pulseService.getInsights(user.id, year, false)),
            _redis: new Date().toISOString()
          }
        }
        redis.json.set(`insights:${user.id}`, "$", result)
      }
      let result = {}
      for (const year of years) {
        result[year] = {
          ...(await pulseService.getInsights(null, year, true)),
          _redis: new Date().toISOString()
        }
      }
      redis.json.set(`insights:global`, "$", result)
      const end = new Date().getTime()
      console.info(`[REDIS] Insights cache generated in ${end - start}ms`)
    } catch {}
  }
  async purgeInvite(inviteKey: string) {
    console.info("[REDIS] Purging invite from cache...")
    redis.json.del(`invites:${inviteKey}`)
  }

  async refreshState() {
    try {
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
    } catch {
      return null
    }
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

  async generateAutoCollectCache(userId?: number) {
    try {
      console.info("[REDIS] Generating User AutoCollection cache...")
      let start = new Date().getTime()
      let users
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })] as User[]
      }
      for (const user of users) {
        let result = []
        let autoCollects = await AutoCollectApproval.findAll({
          where: {
            userId: user.id
          }
        })
        const collectionIds = [
          ...new Set(autoCollects.map((a) => a.collectionId))
        ]
        for (const id of collectionIds) {
          result.push({
            ...(await this.getCachedCollection(user.id, id)),
            autoCollectApprovals: autoCollects.filter(
              (a) => a.collectionId === id
            )
          })
        }
        redis.json.set(`autoCollects:${user.id}`, "$", result)
      }
      let end = new Date().getTime()
      console.info(
        `[REDIS] User AutoCollection cache generated in ${end - start}ms`
      )
    } catch {}
  }

  async patchAutoCollectCache(
    userId: number,
    collectionId: number,
    approvalId: number
  ) {
    console.log("[REDIS] Patching AutoCollect cache for user...")
    const autoCollects = await redis.json.get(`autoCollects:${userId}`)
    const collection = autoCollects.find(
      (c: Collection) => c.id === collectionId
    )
    if (collection) {
      collection.autoCollectApprovals = collection.autoCollectApprovals.filter(
        (a: AutoCollectApproval) => a.id !== approvalId
      )
      if (!collection.autoCollectApprovals.length) {
        autoCollects.splice(autoCollects.indexOf(collection), 1)
      }
      redis.json.set(`autoCollects:${userId}`, "$", autoCollects)
    }
  }

  async getCachedCollection(userId: number, collectionId: number) {
    const collectionService = Container.get(CollectionService)
    if (await redis.json.get(`collections:${userId}`)) {
      const collections = await redis.json.get(`collections:${userId}`)
      return collections?.find((c: Collection) => c.id === collectionId) || null
    } else {
      this.generateCollectionCache().then(() => {})
      return await collectionService.getCollection(collectionId)
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
    console.info(
      `[REDIS] Collections ShareLink cache generated in ${end - start}ms`
    )
  }

  async generateCollectionCache(userId?: number) {
    try {
      const collectionService = Container.get(CollectionService)
      console.info("[REDIS] Generating collections cache...")
      let start = new Date().getTime()
      let users
      if (!userId) {
        users = await User.findAll()
      } else {
        users = [await User.findOne({ where: { id: userId } })] as User[]
      }
      for (const user of users) {
        const collections = await collectionService.getCollections(user.id)
        redis.json.set(`collections:${user.id}`, "$", collections)
      }
      let end = new Date().getTime()
      console.info(`[REDIS] Collections cache generated in ${end - start}ms`)
      this.generateAutoCollectCache().then(() => {})
    } catch (e) {
      console.error(e)
    }
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
    try {
      const collectionService = Container.get(CollectionService)
      console.info(
        "[REDIS] Generating collections cache for individual collection..."
      )
      let start = new Date().getTime()
      const collection = await collectionService.getCollection(id)

      async function updateCache(user: CollectionUser) {
        const id = user.recipientId

        console.info("[REDIS] Patching cache for user", id)
        const collections = await redis.json.get(`collections:${id}`)
        const index: number = collections.findIndex(
          (c: Collection) => c.id === collection.id
        )
        if (index === -1) {
          collections.push({
            ...collection.toJSON(),
            permissionsMetadata: {
              write: user.write,
              read: user.read,
              configure: user.configure,
              recipient: user?.id ? user : null
            }
          })
        } else {
          collections[index] = {
            ...collection.toJSON(),
            permissionsMetadata: {
              write: user.write,
              read: user.read,
              configure: user.configure
            },
            recipient: user?.id ? user : null
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
      console.info(
        `[REDIS] Individual collection cache generated in ${end - start}ms`
      )
    } catch {}
  }

  cacheInit() {
    try {
      // 10 minutes
      setInterval(this.refreshState, 1000 * 60 * 10)
      // 30 minutes
      setInterval(this.generateUserStatsCache, 1000 * 60 * 30)
      // 1 hour
      setInterval(this.generateCollectionCache, 3600000)
      setInterval(this.generateShareLinkCache, 3600000)

      cron.schedule("0 5 * * *", () => {
        this.generateInsightsCache()
      })

      cron.schedule("0 4 * * *", () => {
        this.generateCollectionCache()
      })

      this.refreshState().then(() => {})
      this.generateShareLinkCache().then(() => {})
      this.generateUserStatsCache().then(() => {})
      this.generateChatsCache().then(() => {})
      this.generateMissingChatDates().then(() => {})
      return true
    } catch {
      return false
    }
  }
}
