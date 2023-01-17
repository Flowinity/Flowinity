import { Service } from "typedi"
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"
import Errors from "@app/lib/errors"
import { Domain } from "@app/models/domain.model"
import { Feedback } from "@app/models/feedback.model"

@Service()
export class UserUtilsService {
  async getInvite(key: string): Promise<string> {
    return key
  }

  async getAllUsers(): Promise<User[]> {
    return User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "description",
        "administrator",
        "darkTheme",
        "banned",
        "inviteId",
        "avatar"
      ],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Plan,
          as: "plan"
        }
      ]
    })
  }

  async getUser(username: string): Promise<User | null> {
    return await User.findOne({
      where: {
        username: username
      },
      attributes: [
        "id",
        "username",
        "email",
        "description",
        "administrator",
        "darkTheme",
        "banned",
        "inviteId",
        "avatar"
      ],
      include: [
        {
          model: Plan,
          as: "plan"
        }
      ]
    })
  }

  async setDefaultDomain(id: number, domainName: string): Promise<[affectedCount: number]> {
    const domain = await Domain.findOne({
      where: {
        domain: domainName,
        active: true
      }
    })
    if (!domain) throw Errors.PLACEHOLDER
    return await User.update(
      {
        domainId: domain.id
      },
      {
        where: {
          id
        }
      }
    )
  }

  async sendFeedback(id: number, feedbackText: string, starRating: number, route: string): Promise<void> {
    await Feedback.create({
      userId: id,
      feedbackText,
      starRating,
      route,
      debugInfo: "isTPUV2"
    })
  }
}
