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

export enum CacheType {
  "everything",
  "state",
  "collections",
  "sharelinks",
  "autocollects",
  "invites",
  "chats",
  "insights",
  "userstats"
}

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
    return User.findAll()
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
    currentExperiments: Experiment[],
    overrides: { [key: string]: string | number | boolean },
    userId: number,
    dev: boolean = false
  ) {
    const experiments = Object.entries(overrides).reduce(
      (acc, [name, value]) => {
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

    let data = uploads.reduce((acc, upload) => {
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
}
