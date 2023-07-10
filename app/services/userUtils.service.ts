import {Container, Service} from "typedi"
import {User} from "@app/models/user.model"
import {Plan} from "@app/models/plan.model"
import Errors from "@app/lib/errors"
import {Domain} from "@app/models/domain.model"
import {Feedback} from "@app/models/feedback.model"
import argon2 from "argon2"
import speakeasy from "@levminer/speakeasy"
import {CollectionCache} from "@app/types/collection"
import {Friend} from "@app/models/friend.model"
import {Notification} from "@app/models/notification.model"
import utils from "@app/lib/utils"
import {AdminService} from "@app/services/admin.service"
import {SortValidate} from "@app/validators/sort"
import paginate from "jw-paginate"
import {Op} from "sequelize"
import {Badge} from "@app/models/badge.model"
import {FriendNickname} from "@app/models/friendNickname"
import {ThemeEngineValidate} from "@app/validators/themeEngine"
import {CoreService} from "@app/services/core.service"
import {LayoutValidate} from "@app/validators/userv3"
import {ExcludedCollectionsValidate} from "@app/validators/excludedCollections"
import {FCMDevice} from "@app/models/fcmDevices.model"
import axios from "axios"

@Service()
export class UserUtilsService {
    async registerFCMToken(userId: number, token: string) {
        if (!config.providers.google) return
        const device = await FCMDevice.findOne({
            where: {
                registrationKey: token
            }
        })
        if (device) return undefined
        const user = await User.findOne({
            where: {
                id: userId
            },
            attributes: ["id", "username", "fcmNotificationKey"]
        })
        if (!user) throw Errors.USER_NOT_FOUND
        if (user.fcmNotificationKey) {
            await axios.post(
                "https://fcm.googleapis.com/fcm/notification",
                {
                    operation: "add",
                    notification_key_name: `user-${user.id}`,
                    notification_key: user.fcmNotificationKey,
                    registration_ids: [token]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `key=${config.providers.google.access_token}`,
                        project_id: config.providers.google.project_info.project_number
                    }
                }
            )
        } else {
            const {data} = await axios.post(
                "https://fcm.googleapis.com/fcm/notification",
                {
                    operation: "create",
                    notification_key_name: `user-${user.id}`,
                    registration_ids: [token]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `key=${config.providers.google.access_token}`,
                        project_id: config.providers.google.project_info.project_number
                    }
                }
            )
            await User.update(
                {
                    fcmNotificationKey: data.notification_key
                },
                {
                    where: {
                        id: user.id
                    }
                }
            )
        }
        const devices = await FCMDevice.findAll({
            where: {
                userId,
                invalid: false
            }
        })
        if (devices.length >= 20) {
            await FCMDevice.update(
                {
                    invalid: true
                },
                {
                    where: {
                        userId
                    },
                    limit: 1
                }
            )
        }

        await FCMDevice.create({
            userId,
            registrationKey: token
        })

        const fcmUser = await User.findOne({
            where: {
                id: userId
            },
            attributes: ["fcmNotificationKey"]
        })
        await redis.set(
            `user:${userId}:notificationKey`,
            fcmUser?.fcmNotificationKey
        )
    }

    async setFriendNickname(userId: number, friendId: number, name: string) {
        const user = await User.findOne({
            where: {
                id: friendId
            }
        })
        if (!user) throw Errors.USER_NOT_FOUND
        const nickname = await FriendNickname.findOne({
            where: {
                userId,
                friendId
            }
        })
        if (!nickname && name) {
            await FriendNickname.create({
                userId,
                friendId,
                nickname: name
            })
        } else if (name) {
            await FriendNickname.update(
                {
                    nickname: name
                },
                {
                    where: {
                        userId,
                        friendId
                    }
                }
            )
        } else if (nickname) {
            await FriendNickname.destroy({
                where: {
                    userId,
                    friendId
                }
            })
        } else {
            return null
        }
        socket.to(userId).emit("friendNickname", {
            id: friendId,
            nickname: name
        })
        return name
    }

    async verifyEmail(token: string) {
        const user = await User.findOne({
            where: {
                emailToken: token
            }
        })
        if (!user) throw Errors.INVALID_EMAIL_TOKEN
        await User.update(
            {
                emailVerified: true,
                emailToken: null
            },
            {
                where: {
                    id: user.id
                }
            }
        )
        return true
    }

    async sendVerificationEmail(userId: number) {
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if (!user || user.emailVerified) throw Errors.USER_NOT_FOUND
        const code = await utils.generateAPIKey("email")
        await User.update(
            {
                emailToken: code
            },
            {
                where: {
                    id: userId
                }
            }
        )
        const adminService = Container.get(AdminService)
        adminService.sendEmail(
            {
                body: {
                    name: user.username,
                    intro:
                        "You recently requested to verify your email address for your TPU account. Please click the button below to verify your email address.",
                    action: [
                        {
                            instructions: `Click the button below to verify your account and start using TPU!`,
                            button: {
                                color: "#0190ea", // Optional action button color
                                text: "Verify",
                                link: config.hostnameWithProtocol + "/verify/" + code
                            }
                        }
                    ],
                    outro: "Thank you for using TPU!"
                }
            },
            user.email,
            "TPU Email Verification"
        )
        return true
    }

    async validateFriends(userId: number, friendIds: number[]) {
        const friends = await Friend.findAll({
            where: {
                userId,
                friendId: friendIds,
                status: "accepted"
            }
        })
        if (friends.length !== friendIds.length)
            throw Errors.INVALID_FRIEND_SELECTION
        return friends
    }

    async getFriend(userId: number, friendId: number) {
        return await Friend.findOne({
            where: {
                userId,
                friendId
            },
            include: [
                {
                    model: User,
                    as: "otherUser",
                    attributes: ["id", "username", "avatar", "description", "banner"],
                    include: [
                        {
                            model: FriendNickname,
                            as: "nickname",
                            required: false,
                            where: {
                                userId
                            }
                        },
                        {
                            model: Plan,
                            as: "plan",
                            attributes: ["id", "name", "color", "icon", "internalName"]
                        }
                    ]
                }
            ]
        })
    }

    async getFriends(userId: number) {
        let friends = await Friend.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: User,
                    as: "otherUser",
                    attributes: [
                        "id",
                        "username",
                        "avatar",
                        "status",
                        "description",
                        "banner"
                    ],
                    include: [
                        {
                            model: FriendNickname,
                            as: "nickname",
                            required: false,
                            where: {
                                userId
                            }
                        },
                        {
                            model: Plan,
                            as: "plan",
                            attributes: ["id", "name", "color", "icon", "internalName"]
                        }
                    ]
                }
            ]
        })
        for (const friend of friends) {
            if (friend.status !== "accepted") {
                friend.dataValues.otherUser.status = null
                continue
            }
            friend.dataValues.otherUser.dataValues.stats = await redis.json.get(
                `userStats:${friend.otherUser.id}`
            )

            friend.dataValues.otherUser.dataValues.platforms = await redis.json.get(
                `user:${friend.otherUser.id}:platforms`
            )
        }
        return friends
    }

    async updateBanner(
        userId: number,
        banner: string | null,
        type: "banner" | "avatar"
    ) {
        return await User.update(
            {
                [type]: banner
            },
            {
                where: {
                    id: userId
                }
            }
        )
    }

    async createNotification(
        userId: number,
        message: string,
        route?: string
    ) {
        const notification = await Notification.create({
            userId,
            message,
            route
        })
        socket.to(userId).emit("notification", notification)
    }

    async removeFriend(userId: number, friendId: number) {
        await Friend.destroy({
            where: {
                userId,
                friendId
            }
        })
        await Friend.destroy({
            where: {
                userId: friendId,
                friendId: userId
            }
        })

        socket.to(friendId).emit("friendRequest", {
            id: userId,
            status: "removed",
            friend: null
        })
        socket.to(userId).emit("friendRequest", {
            id: friendId,
            status: "removed",
            friend: null
        })
    }

    async friend(
        userId: number,
        friendId: number | string,
        type: "id" | "username",
        // Used for TPU Kotlin
        action?: "accept" | "remove" | "send"
    ): Promise<boolean> {
        const user = await User.findOne({
            where: {
                [type]: friendId
            },
            attributes: ["username", "id"]
        })

        const otherUser = await User.findOne({
            where: {
                id: userId
            },
            attributes: ["username", "id"]
        })

        if (!user || !otherUser) throw Errors.USER_NOT_FOUND
        if (user.id === userId) throw Errors.CANNOT_FRIEND_SELF

        const friend = await Friend.findOne({
            where: {
                userId,
                friendId: user.id
            }
        })
        if (!friend) {
            // Prevent user spam by avoiding to send the notification if the request is made <30minutes
            if (!(await redis.get(`friendNotification:${user.id}:${userId}`))) {
                await redis.set(
                    `friendNotification:${user.id}:${userId}`,
                    "true",
                    "EX",
                    1800
                )
                await this.createNotification(
                    user.id,
                    `${otherUser.username} has sent you a friend request!`,
                    `/u/${otherUser.username}`
                )
            }
            await Friend.create({
                userId,
                friendId: user.id,
                status: "outgoing"
            })
            await Friend.create({
                userId: user.id,
                friendId: userId,
                status: "incoming"
            })
            socket.to(user.id).emit("friendRequest", {
                id: userId,
                status: "incoming",
                friend: await this.getFriend(user.id, userId)
            })
            socket.to(userId).emit("friendRequest", {
                id: user.id,
                status: "outgoing",
                friend: await this.getFriend(userId, user.id)
            })
            return true
        }

        switch (friend.status) {
            case "outgoing":
                if (action === "send" || action == "accept")
                    throw Errors.FRIEND_REQUEST_ALREADY_SENT
                if (action === "remove") {
                    await this.removeFriend(userId, user.id)
                    return true
                }
                await this.removeFriend(userId, user.id)
                return true
            case "incoming":
                if (action === "send") throw Errors.FRIEND_REQUEST_ALREADY_SENT
                if (action === "remove") {
                    await this.removeFriend(userId, user.id)
                    return true
                }
                await Friend.update(
                    {
                        status: "accepted"
                    },
                    {
                        where: {
                            userId,
                            friendId: user.id
                        }
                    }
                )
                await Friend.update(
                    {
                        status: "accepted"
                    },
                    {
                        where: {
                            userId: user.id,
                            friendId: userId
                        }
                    }
                )
                await this.createNotification(
                    user.id,
                    `${otherUser.username} has accepted your friend request!`,
                    `/u/${otherUser.username}`
                )
                socket.to(user.id).emit("friendRequest", {
                    id: userId,
                    status: "accepted",
                    friend: await this.getFriend(user.id, userId)
                })
                socket.to(userId).emit("friendRequest", {
                    id: user.id,
                    status: "accepted",
                    friend: await this.getFriend(userId, user.id)
                })
                return true
            case "accepted":
                if (action === "send" || action == "accept")
                    throw Errors.FRIEND_REQUEST_ALREADY_SENT
                await this.removeFriend(userId, user.id)
                return true
        }
    }

    async enable2FA(id: number): Promise<object> {
        const code = speakeasy.generateSecret({
            name: "TroploPrivateUploader"
        })
        await User.update(
            {
                totpSecret: code.base32
            },
            {
                where: {
                    id,
                    totpEnable: false
                }
            }
        )
        return {
            secret: code.base32,
            url: code.otpauth_url
        }
    }

    async act2FA(
        id: number,
        code: string,
        type: "validate" | "disable"
    ) {
        const user = await User.findOne({
            where: {
                id
            },
            attributes: ["totpSecret"]
        })

        if (!user?.totpSecret) throw Errors.USER_NOT_FOUND

        try {
            const verify = speakeasy.totp.verify({
                secret: user.totpSecret,
                token: code,
                encoding: "base32"
            })
            if (!verify) throw Errors.INVALID_TOTP
        } catch {
            throw Errors.INVALID_TOTP
        }

        const values =
            type === "validate"
                ? {totpEnable: true}
                : {totpEnable: false, totpSecret: null}

        await User.update(values, {
            where: {
                id
            }
        })

        return true
    }

    async checkPassword(id: number, password: string): Promise<boolean> {
        const user = await User.findOne({
            where: {
                id
            },
            attributes: ["password"]
        })
        if (!user) throw Errors.USER_NOT_FOUND
        return await argon2.verify(user.password, password)
    }

    async updateUser(id: number, body: any) {
        const user = await User.findOne({
            where: {
                id
            },
            attributes: [
                "id",
                "username",
                "email",
                "password",
                "administrator",
                "moderator",
                "status"
            ],
            include: [
                {
                    model: Plan,
                    as: "plan",
                    attributes: ["internalName"]
                }
            ]
        })

        if (!user) throw Errors.USER_NOT_FOUND

        const allowedFields = [
            "username",
            "email",
            "password",
            "currentPassword",
            "discordPrecache",
            "darkTheme",
            "description",
            "itemsPerPage",
            "storedStatus",
            "weatherUnit",
            "themeEngine",
            "insights",
            "profileLayout",
            "language",
            "excludedCollections",
            "publicProfile",
            "privacyPolicyAccepted"
        ]

        // from body, remove all empty values
        for (const key in body) {
            if (!allowedFields.includes(key)) {
                delete body[key]
            }
            if (
                (body[key] === "" && key !== "description") ||
                body[key] === null ||
                body[key] === undefined
            ) {
                delete body[key]
            }
        }

        if (body.themeEngine) {
            ThemeEngineValidate.parse(body.themeEngine)
        }

        if (
            body.themeEngine &&
            user.plan.internalName !== "GOLD" &&
            config.officialInstance
        ) {
            body.themeEngine = null
        }

        if (body.currentPassword) {
            if (!(await argon2.verify(user.password, body.currentPassword))) {
                throw Errors.INVALID_CREDENTIALS
            }
            if (body.password) {
                body.password = await argon2.hash(body.password)
            }
        } else {
            delete body.password
            delete body.currentPassword
            delete body.username
        }
        if (body.storedStatus && body.storedStatus !== user.storedStatus) {
            const sockets = await socket.in(user.id).allSockets()
            if (sockets.size !== 0) {
                const status =
                    body.storedStatus === "invisible" ? "offline" : body.storedStatus
                await User.update(
                    {
                        status
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                )
                if (body.storedStatus !== "invisible" || user.status !== "offline") {
                    await this.emitToFriends(user.id, "userStatus", {
                        id: user.id,
                        status,
                        platforms: await redis.json.get(`user:${user.id}:platforms`)
                    })
                }
            }
        }
        if (body.profileLayout !== undefined && body.profileLayout !== null) {
            if (
                !(await Container.get(CoreService).checkExperiment(
                    user.id,
                    "USER_V3_MODIFY",
                    user.administrator || user.moderator
                ))
            ) {
                delete body.profileLayout
            }
        }
        if (body.profileLayout) await LayoutValidate.parse(body.profileLayout)
        if (body.excludedCollections)
            await ExcludedCollectionsValidate.parse(body.excludedCollections)
        await user.update(body)
        delete body.currentPassword
        delete body.password
        socket.to(user.id).emit("userSettingsUpdate", body)
        return true
    }

    async emitToFriends(userId: number, key: string, value: any) {
        const friends = await Friend.findAll({
            where: {
                userId,
                status: "accepted"
            }
        })
        for (const friend of friends) {
            socket.to(friend.friendId).emit(key, value)
        }
        socket.to(userId).emit(key, value)
    }

    async getAllUsers(
        page: number = 1,
        sort: string = "id",
        order: string = "desc",
        search: string = ""
    ) {
        SortValidate.parse({
            sort,
            order
        })
        const where = {
            banned: false,
            username: {
                [Op.like]: `%${search}%`
            }
        }
        let users: User[] = await User.findAll({
            attributes: [
                "id",
                "username",
                "description",
                "administrator",
                "darkTheme",
                "banned",
                "inviteId",
                "avatar",
                "moderator",
                "createdAt"
            ],
            where,
            order: [
                [sort, order],
                [{model: Badge, as: "badges"}, "priority", "DESC"],
                [{model: Badge, as: "badges"}, "id", "ASC"]
            ],
            include: [
                {
                    model: Plan,
                    as: "plan"
                },
                {
                    model: Badge,
                    as: "badges",
                    where: {
                        priority: {
                            [Op.gt]: 0
                        }
                    },
                    required: false
                }
            ],
            limit: 24,
            offset: (page - 1) * 24
        })
        const userCount = await User.count({where})
        const pager = paginate(userCount, page, 24)
        return {
            users,
            pager
        }
    }

    async getMutualFriends(userId: number, friendId: number): Promise<Friend[]> {
        const friends = await Friend.findAll({
            where: {
                userId,
                status: "accepted"
            },
            attributes: ["friendId"]
        })
        return await Friend.findAll({
            where: {
                userId: friends.map((f) => f.friendId),
                friendId: friendId,
                status: "accepted"
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "username",
                        "avatar",
                        "description",
                        "administrator",
                        "moderator"
                    ],
                    include: [
                        {
                            model: Plan,
                            as: "plan"
                        }
                    ]
                }
            ],
            attributes: ["id", "friendId", "userId"]
        })
    }

    async getMutualCollections(
        userId: number,
        otherUserId: number
    ): Promise<CollectionCache[]> {
        const collections = await redis.json.get(`collections:${userId}`)
        const userCollections = await redis.json.get(`collections:${otherUserId}`)

        if (collections && userCollections) {
            return (
                collections
                    .filter((collection: CollectionCache) =>
                        userCollections.some(
                            (userCollection: CollectionCache) =>
                                userCollection.id === collection.id
                        )
                    )
                    .map((collection: CollectionCache) => {
                        return {
                            id: collection.id,
                            name: collection.name,
                            image: collection.image,
                            preview: collection.preview?.attachment?.attachment,
                            items: collection.items
                        }
                    }) || []
            )
        } else {
            return []
        }
    }

    async getFriendStatus(
        userId: number,
        otherUserId: number
    ): Promise<string | false> {
        const friend = await Friend.findOne({
            where: {
                userId,
                friendId: otherUserId
            }
        })
        if (!friend) return false
        return friend.status
    }

    async getUserById(
        userId: number,
        full: boolean = false
    ): Promise<User | null> {
        let user = await User.findOne({
            where: {
                id: userId
            },
            attributes: [
                "id",
                "username",
                "description",
                "administrator",
                "moderator",
                "banned",
                "inviteId",
                "avatar",
                "createdAt",
                "updatedAt",
                "banner",
                "quota",
                "insights",
                "profileLayout"
            ],
            include: [
                {
                    model: Plan,
                    as: "plan"
                }
            ]
        })
        if (!user) return null
        if (full) {
            user.dataValues.collections = await this.getMutualCollections(
                userId,
                user.id
            )
            user.dataValues.friend = await this.getFriendStatus(userId, user.id)
            user.dataValues.friends = await this.getMutualFriends(user.id, userId)
            user.dataValues.stats = await redis.json.get(`userStats:${user.id}`)
        }
        return user
    }

    async getUser(
        username: string,
        userId: number | undefined
    ): Promise<User | null> {
        let user = await User.findOne({
            where: {
                username
            },
            attributes: [
                "id",
                "username",
                "description",
                "administrator",
                "moderator",
                "darkTheme",
                "banned",
                "inviteId",
                "avatar",
                "createdAt",
                "updatedAt",
                "banner",
                "quota",
                "themeEngine",
                "insights",
                "profileLayout",
                "publicProfile"
            ],
            include: [
                {
                    model: Plan,
                    as: "plan"
                },
                {
                    model: Badge,
                    as: "badges"
                }
            ],
            order: [
                [{model: Badge, as: "badges"}, "priority", "DESC"],
                [{model: Badge, as: "badges"}, "id", "ASC"]
            ]
        })

        if (!user) return null
        user.dataValues.noFriends = !(await Friend.count({
            where: {
                userId: user.id,
                status: "accepted"
            }
        }))
        user.dataValues.stats = await redis.json.get(`userStats:${user.id}`)
        if (userId) {
            user.dataValues.collections = await this.getMutualCollections(
                userId,
                user.id
            )
            user.dataValues.friend = await this.getFriendStatus(userId, user.id)
            user.dataValues.friends = await this.getMutualFriends(user.id, userId)
            if (user.dataValues.friend !== "accepted" && user.id !== userId) {
                user.dataValues.stats.hours = null
                user.dataValues.stats.uploadGraph = null
            } else {
                user.dataValues.platforms = await redis.json.get(
                    `user:${user.id}:platforms`
                )
            }
        } else if (
            user?.profileLayout?.layout.columns[0].rows.find(
                (row) => row.name === "core-statistics"
            )?.props?.friendsOnly
        ) {
            user.dataValues.stats.hours = null
            user.dataValues.stats.uploadGraph = null
        }
        if (!user.themeEngine?.showOnProfile) user.themeEngine = null
        return user
    }

    async setDefaultDomain(
        id: number,
        domainName: string
    ): Promise<[affectedCount: number]> {
        const domain = await Domain.findOne({
            where: {
                domain: domainName,
                active: true
            }
        })
        if (!domain) throw Errors.DOMAIN_NOT_FOUND
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

    async sendFeedback(
        id: number | undefined,
        feedbackText: string,
        starRating: number,
        route: string,
        debugInfo?: string
    ) {
        await Feedback.create({
            userId: id,
            feedbackText,
            starRating,
            route,
            debugInfo: debugInfo ?? "isTPUV2"
        })
    }
}
