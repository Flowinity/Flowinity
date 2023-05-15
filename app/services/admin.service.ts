import { Container, Service } from "typedi"
import { CacheService } from "@app/services/cache.service"
import { User } from "@app/models/user.model"
import { Invite } from "@app/models/invite.model"
import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import { Announcement } from "@app/models/announcement.model"
import { Experiment } from "@app/models/experiment.model"
import { CoreService } from "@app/services/core.service"
import { Feedback } from "@app/models/feedback.model"
import { Upload } from "@app/models/upload.model"
import path from "path"
import * as fs from "fs"
import { Friend } from "@app/models/friend.model"
import Errors from "@app/lib/errors"
import { Collection } from "@app/models/collection.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Op } from "sequelize"
import { Chat } from "@app/models/chat.model"
import { Badge } from "@app/models/badge.model"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Message } from "@app/models/message.model"
import { CacheType } from "@app/enums/admin/CacheType"

const inviteParams = {
  include: [
    {
      model: User,
      as: "user",
      attributes: ["id", "username", "avatar", "email"]
    },
    {
      model: User,
      as: "invited",
      attributes: ["id", "username", "avatar", "email"]
    }
  ],
  attributes: [
    "email",
    "adminId",
    "inviteKey",
    "status",
    "userId",
    "registerUserId",
    "createdAt",
    "updatedAt"
  ]
}

@Service()
export class AdminService {
  constructor(private readonly cacheService: CacheService) {}
  async getFeedback() {
    return await Feedback.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
        }
      ],
      order: [["createdAt", "DESC"]]
    })
  }
  async createAnnouncement(
    content: string,
    userId: number
  ): Promise<Announcement> {
    let announcement = await Announcement.create({
      content,
      userId
    })
    return announcement
  }
  async getInvites() {
    return Invite.findAll({
      ...inviteParams
    })
  }

  async actOnInvite(
    inviteKey: string,
    action: "accepted" | "rejected"
  ): Promise<Invite | null> {
    await Invite.update(
      {
        status: action
      },
      {
        where: {
          inviteKey
        }
      }
    )
    return await Invite.findOne({
      where: {
        inviteKey
      },
      ...inviteParams
    })
  }

  async getUsers() {
    return User.findAll({
      attributes: {
        exclude: ["emailToken", "storedStatus"]
      }
    })
  }

  async getStats() {
    //TODO
    return {
      tpu: {
        users: await User.count(),
        uploads: await Upload.count(),
        friends: await Friend.count(),
        invites: await Invite.count(),
        feedback: await Feedback.count(),
        announcements: await Announcement.count(),
        experiments: await Experiment.count(),
        collections: await Collection.count(),
        shareLinks: await Collection.count({
          where: {
            shareLink: {
              [Op.ne]: null
            }
          }
        }),
        autoCollects: await AutoCollectApproval.count(),
        chats: await Chat.count(),
        uploadsSize: await Upload.sum("fileSize")
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    }
  }

  async purgeCache(type: CacheType) {
    switch (type) {
      case CacheType.everything:
        await this.cacheService.refreshState()
        await this.cacheService.generateCollectionCache()
        await this.cacheService.generateShareLinkCache()
        return true
      case CacheType.state:
        await this.cacheService.refreshState()
        return true
      case CacheType.collections:
        await this.cacheService.generateCollectionCache()
        return true
      case CacheType.sharelinks:
        await this.cacheService.generateShareLinkCache()
        return true
      case CacheType.autocollects:
        await this.cacheService.generateAutoCollectCache()
        return true
      case CacheType.invites:
        await redis.del("invites")
        return true
      case CacheType.chats:
        await this.cacheService.generateChatsCache()
        return true
      case CacheType.insights:
        await this.cacheService.generateInsightsCache()
        return true
      case CacheType.userstats:
        await this.cacheService.generateUserStatsCache()
        return true
      case CacheType.lastfm:
        console.log("[AdminService] Purging lastfm cache")
        await redis.del("providers:lastfm:*")
        return true
      case CacheType.mal:
        console.log("[AdminService] Purging mal cache")
        await redis.del("providers:mal:*")
        return true
      default:
        return false
    }
  }

  async purgeUserCache(id: number) {
    await this.cacheService.generateCollectionCacheForUser(id)
    return true
  }

  async sendEmail(mail: Mailgen.Content, email: string, subject: string) {
    console.log("[AdminService] Sending email to", email)
    let mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        name: "TroploPrivateUploader",
        link: "https://images.flowinity.com"
      }
    })
    let emailBody = mailGenerator.generate(mail)
    let emailText = mailGenerator.generatePlaintext(mail)
    let transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.username,
        pass: config.email.password
      }
    })
    return await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: subject,
      text: emailText,
      html: emailBody
    })
  }

  async createExperimentOverrides(
    currentExperiments: Record<
      string,
      string | number | boolean | undefined | null
    >,
    overrides: { [key: string]: string | number | boolean | undefined | null },
    userId: number,
    dev: boolean = false
  ) {
    const experiments = Object.entries(overrides).reduce(
      (acc: Record<string, any>, [name, value]: any) => {
        try {
          if (name === "meta") return acc
          const val = JSON.parse(<string>value)
          if (val !== currentExperiments[name] && value !== "destroy") {
            acc[name] = val
          }
          return acc
        } catch {
          if (value !== currentExperiments[name] && value !== "destroy") {
            acc[name] = value
          }
          return acc
        }
      },
      {}
    )
    const experimentsToDelete = Object.entries(overrides).reduce(
      (acc, [name, value]) => {
        if (value === "destroy") {
          acc.push(name)
        }
        return acc
      }
    )
    for (const experiment of experimentsToDelete) {
      await Experiment.destroy({
        where: {
          key: experiment,
          userId
        }
      })
    }

    for (const [key, value] of Object.entries(experiments)) {
      await Experiment.create({
        key,
        value: JSON.stringify(value),
        userId
      })
    }
    const coreService = Container.get(CoreService)
    return await coreService.getUserExperiments(userId, dev)
  }

  async exportCSVUploads() {
    let uploads = await Upload.findAll({
      attributes: ["createdAt", "id"],
      order: [["createdAt", "DESC"]],
      raw: true
    })

    let data = uploads.reduce((acc: any, upload) => {
      const date = dayjs(upload.createdAt).format("YYYY-MM-DD")
      if (date === "Invalid Date") return acc
      if (!acc[date]) {
        acc[date] = 1
      } else {
        acc[date]++
      }
      return acc
    })

    return Object.entries(data)
      .map(([date, count]) => `${date},${count}`)
      .join("\n")
  }

  async getServices() {
    // get all typedi service functions
    const container = Container as any
    const services = container?.globalInstance?.services
    if (!services) return []
    const serviceNames = Object.keys(services)
    const serviceFunctions = serviceNames.map((name) => {
      return services[name]
    })
    // get all typedi service names
    let serviceNamesWithTypes = serviceFunctions.map((service) => {
      return {
        name: service.type.name,
        functions: [] as (string[] | null)[]
      }
    })
    for (const service of serviceNamesWithTypes) {
      // contains controller, application or server
      if (
        service.name.toLowerCase().includes("controller") ||
        service.name.toLowerCase().includes("application") ||
        service.name.toLowerCase().includes("server")
      )
        continue
      const name =
        service.name.charAt(0).toLowerCase() +
        service.name.slice(1).replace("Service", ".service")
      const file = fs.readFileSync(
        path.join(__dirname, `../../app/services/${name}.ts`),
        "utf8"
      )
      // get the function names and also provide the parameters like {"name": "yes", "params": {"id": "number"}}]}
      let functionNames
      try {
        functionNames = file
          .split("\n")
          .filter((line) => line.includes("async"))
          .map((line) => {
            const functionName = line.split("async ")[1].split("(")[0]
            const params = line
              .split("(")[1]
              .split(")")[0]
              .split(",")
              .map((param) => {
                const name = param.split(":")[0]?.trim()
                const type = param.split(":")[1]?.trim()
                return {
                  name,
                  type
                }
              })
            return {
              name: functionName,
              params
            }
          })
      } catch {}
      if (!functionNames) continue
      // @ts-ignore
      service.functions = functionNames
    }
    return serviceNamesWithTypes
  }

  //dev
  async devAcceptFriends() {
    await Friend.update(
      {
        status: "accepted"
      },
      {
        where: {}
      }
    )
  }

  async updatePlanId(userId: number, planId: number) {
    const user = await User.findByPk(userId)
    if (!user) throw Errors.USER_NOT_FOUND
    if (userId === 6 && planId === 6) {
      throw Errors.HANDLED_BY_PAYMENT_PROVIDER
    }
    await User.update(
      {
        planId
      },
      {
        where: {
          id: userId
        }
      }
    )
    return true
  }

  async updateBanned(userId: number, banned: boolean) {
    const user = await User.findByPk(userId)
    if (!user) throw Errors.USER_NOT_FOUND
    if (user.administrator || user.moderator) throw Errors.MANUAL_BAN_REQUIRED
    await User.update(
      {
        banned
      },
      {
        where: {
          id: userId
        }
      }
    )
    return true
  }

  async createBadge(
    name: string,
    description: string,
    icon: string,
    color: string,
    tooltip: string,
    image: string
  ) {
    return await Badge.create({
      name,
      description,
      icon,
      color,
      tooltip,
      image
    })
  }

  async addUsersToBadge(userIdeez: number[], badgeId: number) {
    for (const userId of userIdeez) {
      await BadgeAssociation.create({
        userId,
        badgeId
      })
    }
    return true
  }

  async getBadges() {
    return await Badge.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username", "avatar"]
        }
      ]
    })
  }

  async updateBadge(badge: Badge) {
    await Badge.update(
      {
        ...badge
      },
      {
        where: {
          id: badge.id
        }
      }
    )
    return true
  }

  async deleteBadge(badgeId: number) {
    await Badge.destroy({
      where: {
        id: badgeId
      }
    })
    await BadgeAssociation.destroy({
      where: {
        badgeId
      }
    })
    return true
  }

  async removeUsersFromBadge(userIdeez: number[], badgeId: number) {
    console.log(userIdeez, badgeId)
    for (const userId of userIdeez) {
      await BadgeAssociation.destroy({
        where: {
          userId,
          badgeId
        }
      })
    }
    return true
  }

  // AutoCollect
  async getAutoCollectRules() {
    return await User.findAll({
      attributes: ["id", "username", "avatar"],
      include: [
        {
          model: AutoCollectRule,
          as: "autoCollectRules"
        }
      ]
    })
  }

  // --SCRIPTS--
  async scriptFindChats(
    type: undefined | "group" | "direct" | "channel" = undefined
  ) {
    return await Chat.findAll({
      where: {
        type
      },
      include: [
        {
          model: ChatAssociation,
          as: "users",
          attributes: [
            "id",
            "userId",
            "user",
            "rank",
            "legacyUserId",
            "lastRead",
            "createdAt",
            "updatedAt"
          ],
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
            },
            {
              model: LegacyUser,
              as: "legacyUser",
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            }
          ]
        }
      ]
    })
  }
  async scriptColubrinaGroupOwner() {
    const chats = await this.scriptFindChats("group")
    for (const chat of chats) {
      // if the chat has no owners
      if (!chat.users.find((user) => user.rank === "owner")) {
        // get the owner
        const owner = chat.users.find(
          (user) => user.tpuUser?.id === chat.userId
        )
        if (owner?.tpuUser) {
          await ChatAssociation.update(
            {
              rank: "owner"
            },
            {
              where: {
                id: owner.id
              }
            }
          )
        } else {
          // make a random admin the owner
          const admin = chat.users.find((user) => user.rank === "admin")
          if (admin?.tpuUser) {
            await ChatAssociation.update(
              {
                rank: "owner"
              },
              {
                where: {
                  id: admin.id
                }
              }
            )
          } else {
            const user = chat.users.find((user) => user.rank === "member")
            if (user?.tpuUser) {
              await ChatAssociation.update(
                {
                  rank: "owner"
                },
                {
                  where: {
                    id: user.id
                  }
                }
              )
            } else {
              console.log("no users in chat", chat.id)
            }
          }
        }
      }
    }
    console.log("OK, clearing cache")
    this.purgeCache(6)
  }
  async scriptColubrinaDMOwners() {
    const chats = await this.scriptFindChats("direct")
    for (const chat of chats) {
      // if any of the chats have users of rank admin or owner, set them to member
      for (const user of chat.users) {
        if (user.rank === "admin" || user.rank === "owner") {
          console.log(`changing ${user.user?.username} to member`)
          await ChatAssociation.update(
            {
              rank: "member"
            },
            {
              where: {
                id: user.id
              }
            }
          )
        }
      }
    }
    console.log("OK, clearing cache")
    this.purgeCache(6)
  }
  async scriptColubrinaDMMerge() {
    const chats = await this.scriptFindChats("direct")
    // if any of the chats have the same users, merge them
    for (const chat of chats) {
      for (const chat2 of chats) {
        if (chat.id === chat2.id) continue
        const users = chat.users.map((user) => user.tpuUser?.id)
        const users2 = chat2.users.map((user) => user.tpuUser?.id)
        if (users.length === users2.length) {
          if (users.every((user) => users2.includes(user))) {
            // if the users or users2 contains undefined, skip
            if (users.includes(undefined) || users2.includes(undefined))
              continue
            if (users.length !== 2 || users2.length !== 2) continue
            // delete the other chat from array
            chats.splice(chats.indexOf(chat2), 1)
            // merge the chats
            console.log(
              `merging ${chat.id} and ${chat2.id}, Users: ${users}, Users2: ${users2}`
            )
            await ChatAssociation.destroy({
              where: {
                chatId: chat2.id
              }
            })
            await Message.update(
              {
                chatId: chat.id
              },
              {
                where: {
                  chatId: chat2.id
                }
              }
            )
            await Chat.destroy({
              where: {
                id: chat2.id
              }
            })
          }
        }
      }
    }
    console.log("OK, clearing cache")
    this.purgeCache(6)
  }

  async scriptColubrinaDMIntents() {
    const chats = await this.scriptFindChats("direct")
    for (const chat of chats) {
      if (chat.intent?.length) continue
      const users = chat.users.map((user) => user.tpuUser?.id)
      if (users.length !== 2 || users.includes(undefined)) continue
      users.sort((a, b) => a - b)
      console.log(`setting intent for ${chat.id} to ${users}`)
      // set the intent
      await Chat.update(
        {
          intent: users.join("-")
        },
        {
          where: {
            id: chat.id
          }
        }
      )
    }
    console.log("OK, clearing cache")
    this.purgeCache(6)
  }

  async scriptScanVulnerableMarkupGoogle() {
    const uploads = await Upload.findAll({
      where: {
        type: "image",
        userId: 1
      }
    })
    for (const upload of uploads) {
    }
  }

  async deleteCommunicationsMessage(messageId: number) {
    await Message.destroy({
      where: {
        id: messageId
      }
    })
  }
}
