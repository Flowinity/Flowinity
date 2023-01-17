import { Service } from "typedi"
// @ts-ignore
import { Domain } from "@app/models/domain.model"
import { User } from "@app/models/user.model"
import { Sequelize } from "sequelize"

@Service()
export class DomainService {
  async getDomains() {
    return await Domain.findAll({
      attributes: {
        include: [[Sequelize.fn("COUNT", Sequelize.col("users.id")), "activeUsersCount"]]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatar"]
        },
        {
          model: User,
          as: "users",
          required: false,
          attributes: []
        }
      ],
      group: ["Domain.id", "user.id"]
    })
  }
}
