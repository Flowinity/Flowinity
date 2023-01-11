import { Service } from "typedi"
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"

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
}
