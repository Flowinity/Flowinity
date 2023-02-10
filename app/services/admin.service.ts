import { Service, Container } from "typedi"
import { CacheService } from "@app/services/cache.service"
import { User } from "@app/models/user.model"
import { Invite } from "@app/models/invite.model"
import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import { Announcement } from "@app/models/announcement.model"
import { Experiment } from "@app/models/experiment.model"
import { CoreService } from "@app/services/core.service"
import { Feedback } from "@app/models/feedback.model"

export enum CacheType {
  "everything",
  "state",
  "collections",
  "sharelinks"
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
    return {}
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

  async getConnectedUsers() {
    console.log(socket)
    const clients = socket.socket.sockets
    return clients
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
}
