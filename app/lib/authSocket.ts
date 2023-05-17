import { NextFunction } from "express"
import { SocketAuth } from "@app/types/socket"
import { Session } from "@app/models/session.model"
import { User } from "@app/models/user.model"

const Errors = require("./errors.js")
const { Op } = require("sequelize")

export default async function (socket: SocketAuth, next: NextFunction) {
  try {
    const token = socket.handshake.auth.token
    if (token) {
      const session = await Session.findOne({
        where: {
          token: token,
          type: "session",
          [Op.or]: [
            {
              expiredAt: {
                [Op.gt]: new Date()
              }
            },
            {
              expiredAt: null
            }
          ]
        },
        include: [
          {
            model: User,
            as: "user",
            required: true
          }
        ]
      })
      if (session) {
        if (session.user.banned) {
          socket.emit("error", Errors.unauthorized)
        } else {
          socket.user = session.user
          next()
        }
      }
    }
  } catch (err) {
    console.log(err)
    socket.emit("error", Errors.unauthorized)
  }
}
