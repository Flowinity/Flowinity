import { Arg, Ctx, Mutation, Resolver } from "type-graphql"
import { Container, Service } from "typedi"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Success } from "@app/classes/graphql/generic/success"
import { Context } from "@app/types/graphql/context"
import { Chat } from "@app/models/chat.model"
import { ChatRank } from "@app/models/chatRank.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { ChatPermissionsHandler } from "@app/services/chat/permissions"
import { User } from "@app/models/user.model"
import { UserUtilsService } from "@app/services/userUtils.service"
import { ClearCacheInput } from "@app/classes/graphql/admin/cache"
import { AdminService } from "@app/services/admin.service"
import { EXPECTED_OPTIONS_KEY } from "dataloader-sequelize"
import { Sequelize } from "sequelize-typescript"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Message } from "@app/models/message.model"
import cryptoRandomString from "crypto-random-string"
import { LegacyFriend } from "@app/models/legacyFriend.model"
import { Friend } from "@app/models/friend.model"
import { PulseService } from "@app/services/pulse.service"

@Resolver()
@Service()
export class AdminResolver {
  constructor(
    private userUtilsService: UserUtilsService,
    private adminService: AdminService
  ) {}

  @Authorization({
    accessLevel: AccessLevel.ADMIN,
    scopes: "*"
  })
  @Mutation(() => Success)
  async adminMigrateLegacyRanksForChat(@Ctx() ctx: Context): Promise<Success> {
    const chats = await Chat.findAll({
      include: [
        {
          model: ChatRank,
          as: "ranks",
          required: false,
          where: {
            managed: true
          }
        },
        {
          model: ChatAssociation,
          as: "users",
          required: false
        }
      ]
    })
    const applicable = chats.filter((chat) => !chat.ranks.length)
    for (const chat of applicable) {
      const service = new ChatPermissionsHandler()
      await service.createDefaults(chat)
      console.log(chat.id)
    }
    return { success: true }
  }

  @Authorization({
    accessLevel: AccessLevel.ADMIN,
    scopes: "*"
  })
  @Mutation(() => Success)
  async adminSendEmailForUnverifiedUsers(
    @Ctx() ctx: Context
  ): Promise<Success> {
    const users = await User.findAll({
      where: {
        emailVerified: false
      }
    })
    for (const user of users) {
      console.log(`sending for ${user.username}`)
      this.userUtilsService.sendVerificationEmail(user.id, true, false)
      await new Promise((resolve) => setTimeout(resolve, 60000))
    }
    return { success: true }
  }

  @Authorization({
    accessLevel: AccessLevel.ADMIN,
    scopes: "*"
  })
  @Mutation(() => Success)
  async adminClearCache(
    @Ctx() ctx: Context,
    @Arg("input") input: ClearCacheInput
  ) {
    if (input.userId) {
      if (input.await) {
        await this.adminService.purgeUserCache(input.userId)
      } else {
        this.adminService.purgeUserCache(input.userId)
      }
      return { success: true }
    } else {
      if (input.await) {
        await this.adminService.purgeCache(input.type)
      } else {
        this.adminService.purgeCache(input.type)
      }
      return { success: true }
    }
  }

  @Authorization({
    accessLevel: AccessLevel.ADMIN,
    scopes: "*"
  })
  @Mutation(() => Success)
  async adminDebugBatch(@Ctx() ctx: Context) {
    console.log(User.findByPk)
    // get sequelize-typescript instance for dataloader-sequelize
    const [user1, user2] = await Promise.all([
      User.findByPk(1, {
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      }),
      User.findByPk(6, {
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      })
    ])

    await User.findByPk(1, {
      [EXPECTED_OPTIONS_KEY]: ctx.dataloader
    })
    await User.findByPk(1, {
      [EXPECTED_OPTIONS_KEY]: ctx.dataloader
    })

    console.log(user1?.username, user2?.username)
    return { success: true }
  }

  async transferToNormal(user: User, legacy: LegacyUser) {
    await ChatAssociation.update(
      {
        userId: user.id,
        legacyUserId: null
      },
      {
        where: {
          legacyUserId: legacy.id
        }
      }
    )

    await Chat.update(
      {
        userId: user.id,
        legacyUserId: null
      },
      {
        where: {
          legacyUserId: legacy.id
        }
      }
    )

    await Message.update(
      {
        userId: user.id,
        legacyUserId: null
      },
      {
        where: {
          legacyUserId: legacy.id
        }
      }
    )
  }

  @Authorization({
    accessLevel: AccessLevel.ADMIN,
    scopes: "*"
  })
  @Mutation(() => Success)
  async adminMigrateLegacyToNormalUsers(@Ctx() ctx: Context) {
    const legacyToNormalMap = new Map<number, number>()

    const legacyUsers = await LegacyUser.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "emailVerified",
        "password",
        "avatar",
        "createdAt",
        "updatedAt"
      ]
    })
    for (const [index, legacy] of legacyUsers.entries()) {
      const user = await User.findOne({
        where: {
          email: legacy.email
        },
        attributes: ["id", "username", "email", "emailVerified", "password"]
      })
      if (legacy.emailVerified && user?.emailVerified) {
        legacyToNormalMap.set(legacy.id, user.id)
        await this.transferToNormal(user, legacy)
        await legacy.destroy()
        console.log(`migrated ${user.username}, was duplicate, merged.`)
      } else if (!user) {
        const usernameCheck = await User.findOne({
          where: {
            username: legacy.username
          },
          attributes: ["id", "username", "email", "emailVerified", "password"]
        })

        const desiredUsername = usernameCheck
          ? `${legacy.username}_${cryptoRandomString({ length: 4 })}`
          : legacy.username

        const user = await User.create({
          username: desiredUsername,
          email: legacy.email,
          emailVerified: legacy.emailVerified,
          password: legacy.password,
          avatar: legacy.avatar,
          createdAt: legacy.createdAt,
          updatedAt: legacy.updatedAt
        })
        legacyToNormalMap.set(legacy.id, user.id)
        await this.transferToNormal(user, legacy)
        await legacy.destroy()
        console.log(`migrated ${user.username}, was legacy.`)

        this.adminService.sendEmail(
          {
            body: {
              name: user.username,
              intro: `Your Colubrina account has been automatically migrated over to Flowinity.<br>Please login with the username <strong>${user.username}</strong>, or your email address.<br><br><a href="https://flowinity.com"><img src="https://i.troplo.com/i/cc7ba831c18a.png" alt="Flowinity Promo" style="max-width: 100%; border-radius: 4px"></a><br><br>The best of Colubrina - now in one place!`,
              action: [
                {
                  instructions: `Click the button below to login to your new account!`,
                  button: {
                    color: "#0190ea",
                    text: "Login",
                    link: "https://flowinity.com/login"
                  }
                }
              ],
              outro:
                "Forgot your password? No problem! You can reset it on the Login page with the button above."
            }
          },
          legacy.email,
          "Colubrina is now Flowinity"
        )
      } else {
        this.adminService.sendEmail(
          {
            body: {
              name: legacy.username,
              intro: `Your Colubrina account could not be automatically migrated over to Flowinity.\nIf you wish to seamlessly migrate over your chats and messages, please go to Settings > Integrations, and enter your Colubrina account credentials to complete the migration process!<br><br><a href="https://flowinity.com"><img src="https://i.troplo.com/i/cc7ba831c18a.png" alt="Flowinity Promo" style="max-width: 100%; border-radius: 4px"></a><br><br>The best of Colubrina - now in one place!`,
              action: [
                {
                  instructions: `Click the button below to register a new account and complete the migration!`,
                  button: {
                    color: "#0190ea",
                    text: "Register",
                    link: "https://flowinity.com/register"
                  }
                }
              ]
            }
          },
          legacy.email,
          "Action Required - Colubrina Account Migration"
        )
      }

      console.log(
        `Done ${legacy.username}, ${index + 1}/${
          legacyUsers.length
        }, ${Math.round(((index + 1) / legacyUsers.length) * 100)}%`
      )
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }

    console.log(legacyToNormalMap)

    // migrate the friends
    const legacyFriends = await LegacyFriend.findAll()
    for (const legacyFriend of legacyFriends) {
      const friend = legacyToNormalMap.get(legacyFriend.friendId)
      const user = legacyToNormalMap.get(legacyFriend.userId)
      if (!friend || !user || legacyFriend.status === "rejected") continue
      const status =
        legacyFriend.status === "pendingCanAccept"
          ? "incoming"
          : legacyFriend.status === "pending"
            ? "outgoing"
            : "accepted"
      await legacyFriend.destroy()
      await Friend.create({
        userId: user,
        friendId: friend,
        createdAt: legacyFriend.createdAt,
        updatedAt: legacyFriend.updatedAt,
        status
      })
    }
    return { success: true }
  }

  @Authorization({
    accessLevel: AccessLevel.ADMIN,
    scopes: "*"
  })
  @Mutation(() => Success)
  async adminGenerateInsights(
    @Ctx() ctx: Context,
    @Arg("userId") userId: number,
    @Arg("type") type: string,
    @Arg("customGte", { nullable: true }) customGte?: string
  ) {
    const pulseService = Container.get(PulseService)
    pulseService.generateInsights(userId, <any>type, customGte)
    return { success: true }
  }
}
