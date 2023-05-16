import { Service } from "typedi"
import { User } from "@app/models/user.model"
import { Feedback } from "@app/models/feedback.model"
import { Op } from "sequelize"
import { Message } from "@app/models/message.model"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"

@Service()
export class BadgeService {
  async checkCriteria() {
    const users = await User.findAll()
    for (const user of users) {
      const feedback = await Feedback.findAll({
        where: {
          userId: user.id,
          feedbackText: {
            [Op.like]: "%SkullCrash%"
          }
        }
      })
      const messages = await Message.findAll({
        where: {
          userId: user.id
        }
      })

      // SKULL BADGE
      if (
        feedback.length >= 50 &&
        messages.filter((message) => message.content.includes(":skull:"))
          .length >= 50
      ) {
        const badge = await BadgeAssociation.findOne({
          where: {
            userId: user.id,
            badgeId: 12
          }
        })
        if (!badge) {
          await BadgeAssociation.create({
            userId: user.id,
            badgeId: 12
          })
        }
      }

      // BASED
      if (
        messages.filter((message) => message.content.includes("based"))
          .length >= 50
      ) {
        const badge = await BadgeAssociation.findOne({
          where: {
            userId: user.id,
            badgeId: 29
          }
        })
        if (!badge) {
          await BadgeAssociation.create({
            userId: user.id,
            badgeId: 29
          })
        }
      }
    }
  }

  async badgeInit() {
    if (!config.finishedSetup) return
    await this.checkCriteria()
    setInterval(async () => {
      await this.checkCriteria()
    }, 3600000)
  }
}
