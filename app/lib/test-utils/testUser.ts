import cryptoRandomString from "crypto-random-string"
import { User } from "@app/models/user.model"
import { Session } from "@app/models/session.model"
import { Op } from "sequelize"

export class TestUser {
  constructor() {
    this.id = 1
    this.username = cryptoRandomString({ length: 10 })
    this.email = cryptoRandomString({ length: 10 }) + "@example.com"
    this.token = ""
    this.password = "password12345678!"
  }
  id: number
  username: string
  email: string
  token: string
  password: string
}

export const testUser = new TestUser()

export const getUser = async (
  id?: number,
  emailVerified = true
): Promise<TestUser> => {
  const u = await User.findOne({
    ...(id
      ? {
          where: {
            id: id || testUser.id
          }
        }
      : emailVerified
      ? {
          where: {
            emailVerified: true,
            username: {
              [Op.notLike]: `%Collectivizer%`
            }
          }
        }
      : {
          where: {
            username: {
              [Op.notLike]: `%Collectivizer%`
            }
          }
        }),
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Session,
        as: "sessions",
        order: [["createdAt", "DESC"]],
        required: true,
        limit: 1
      }
    ]
  })
  if (!u) throw new Error("User not found")
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    token: u.sessions?.[0].token || "",
    password: "password12345678!2"
  }
}
