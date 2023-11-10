import cryptoRandomString from "crypto-random-string"
import { Op } from "sequelize"
import db from "../../db"

export class TestUser {
  constructor() {
    this.id = 1
    this.username = cryptoRandomString({ length: 10 })
    this.email = cryptoRandomString({ length: 10 }) + "-reject@troplo.com"
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
  emailVerified = true,
  admin = false
): Promise<TestUser> => {
  const u = (await db.models.User.findOne({
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
            },
            ...(admin
              ? {
                  administrator: true
                }
              : {})
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
        model: db.models.Session,
        as: "sessions",
        order: [["createdAt", "DESC"]],
        required: true,
        limit: 1
      }
    ]
  })) as any
  if (!u) throw new Error("User not found")
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    token: u.sessions?.[0].token || "",
    password: "password12345678!2"
  }
}
