import {NextFunction} from "express"
import {SocketAuth} from "@app/types/socket"
import {Session} from "@app/models/session.model"
import {User} from "@app/models/user.model"

const Errors = require("./errors")
const {Op} = require("sequelize")

export default async function (socket: SocketAuth, next: NextFunction) {
    try {
        if (!config.finishedSetup)
            socket.emit("error", {
                code: 500,
                message: "TPU instance is misconfigured."
            })
        const token = socket.handshake.auth.token
        if (token && config.finishedSetup) {
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
