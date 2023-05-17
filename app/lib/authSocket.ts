import { NextFunction } from "express"
const { Op } = require("sequelize")

// Import Models
import { Session } from "@app/models/session.model"
import { User } from "@app/models/user.model"

// Import Types
import { SocketAuth } from "@app/types/socket"

// Import Libs
const Errors = require("./errors.js")

export default async function (
  socket: SocketAuth,
  next: NextFunction
): Promise<void> {
  try {
    const token = socket.handshake.auth.token

    if (token) {
      const session: Session | null = await Session.findOne({
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
        if (session.user.banned) socket.emit("error", Errors.unauthorized)
        else {
          socket.user = session.user

          next()
        }
      }
    }
  } catch (err) {
    console.error(err)

    socket.emit("error", Errors.unauthorized)
  }
}
