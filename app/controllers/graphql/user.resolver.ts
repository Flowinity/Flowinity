import {
  Arg,
  ClassType,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription
} from "type-graphql"
import { UserUtilsService } from "@app/services/userUtils.service"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Session } from "@app/models/session.model"
import { Op } from "sequelize"
import { Subscription as SubscriptionModel } from "@app/models/subscription.model"
import { Domain } from "@app/models/domain.model"
import { Plan } from "@app/models/plan.model"
import { Integration } from "@app/models/integration.model"
import { Badge } from "@app/models/badge.model"
import { Context } from "@app/types/graphql/context"
import { Notification } from "@app/models/notification.model"
import {
  PartialUserAuth,
  PartialUserBase,
  partialUserBase,
  PartialUserFriend,
  PartialUserPublic
} from "@app/classes/graphql/user/partialUser"
import { createContext, EXPECTED_OPTIONS_KEY } from "dataloader-sequelize"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import {
  ChangeEmailInput,
  ChangePasswordInput,
  ChangeUsernameInput,
  UpdateUserInput,
  UpdateUserStatusInput
} from "@app/classes/graphql/user/updateUser"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { UserProfileInput } from "@app/classes/graphql/user/profileInput"
import { GraphQLError } from "graphql/error"
import { Stats } from "@app/classes/graphql/core/core"
import { Friend } from "@app/models/friend.model"
import { FriendStatus } from "@app/classes/graphql/user/friends"
import { AutoCollectCache } from "@app/types/collection"
import { FriendNickname } from "@app/models/friendNickname"
import { BlockedUser } from "@app/models/blockedUser.model"
import { GqlError } from "@app/lib/gqlErrors"
import { OauthApp } from "@app/models/oauthApp.model"
import { AuthService } from "@app/services/auth.service"
import argon2 from "argon2"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import RateLimit from "@app/lib/graphql/RateLimit"
import { SessionInput } from "@app/classes/graphql/user/sessionsInput"
import { SessionType } from "@app/classes/graphql/user/sessions"
import { UserStatus, UserStoredStatus } from "@app/classes/graphql/user/status"
import { Collection } from "@app/models/collection.model"
import { defaultHomeWidgets } from "@app/classes/graphql/home/homeWidgets"
import { StatusEvent } from "@app/classes/graphql/user/subscriptions/statusEvent"

@Resolver(User)
@Service()
export class UserResolver extends createBaseResolver("User", User) {
  @Authorization({
    scopes: "user.view",
    userOptional: true
  })
  @Query(() => User || null, {
    nullable: true
  })
  async currentUser(@Ctx() ctx: Context) {
    if (!ctx.user) return null
    return await this.findByPk(ctx.user.id, ctx)
  }

  @FieldResolver(() => String, {
    nullable: true
  })
  async scopes(@Ctx() ctx: Context) {
    return ctx?.scopes || "*"
  }

  @Authorization({
    userOptional: true,
    scopes: []
  })
  @Query(() => PartialUserPublic, {
    nullable: true
  })
  async user(@Arg("input") input: UserProfileInput, @Ctx() ctx: Context) {
    let user: User | null = null
    if (input.username) {
      user = await this.findByUsername(input.username, ctx)
    } else if (input.id) {
      user = await this.findByPk(input.id, ctx)
    } else {
      throw new GraphQLError("You must provide a username or id")
    }

    console.log(user, input)

    if (!user?.publicProfile && !ctx.user) {
      throw new GraphQLError(
        "You must be logged in to view this user's profile."
      )
    }

    if (!user || user.banned) {
      return null
    }
    if (
      ctx.user &&
      (await this.userUtilsService.blocked(ctx.user.id, user.id, true))
    ) {
      throw new GqlError("BLOCKED")
    }
    ctx.meta.friends = ctx.user
      ? await this.userUtilsService.getFriendStatus(ctx.user.id, user.id, true)
      : FriendStatus.NONE
    return user
  }

  @RateLimit({
    window: 30,
    max: 30
  })
  @Authorization({
    scopes: "user.modify",
    emailOptional: true
  })
  @Mutation(() => Boolean)
  async updateUser(@Arg("input") input: UpdateUserInput, @Ctx() ctx: Context) {
    await this.userUtilsService.updateUser(ctx.user!!.id, input)
    return true
  }

  @RateLimit({
    window: 30,
    max: 30
  })
  @Authorization({
    scopes: ["user.modify", "chats.send"],
    emailOptional: true
  })
  @Mutation(() => UserStoredStatus)
  async updateStatus(
    @Arg("input") input: UpdateUserStatusInput,
    @Ctx() ctx: Context
  ) {
    await this.userUtilsService.updateUser(ctx.user!!.id, {
      storedStatus: input.storedStatus
    })
    return input.storedStatus
  }

  @RateLimit({
    window: 30,
    max: 5
  })
  @Authorization({
    scopes: "user.modify",
    emailOptional: true
  })
  @Mutation(() => Boolean)
  async changeUserPassword(
    @Arg("input") input: ChangePasswordInput,
    @Ctx() ctx: Context
  ) {
    await this.authService.validateAuthMethod({
      credentials: {
        password: input.currentPassword,
        totp: input.totp
      },
      password: true,
      alternatePassword: false,
      totp: true,
      userId: ctx.user!!.id
    })
    await User.update(
      {
        password: await argon2.hash(input.newPassword)
      },
      {
        where: {
          id: ctx.user!!.id
        }
      }
    )
    return true
  }

  @RateLimit({
    window: 120,
    max: 5
  })
  @Authorization({
    scopes: "user.modify"
  })
  @Mutation(() => Boolean)
  async changeUsername(
    @Arg("input") input: ChangeUsernameInput,
    @Ctx() ctx: Context
  ) {
    await this.authService.validateAuthMethod({
      credentials: {
        password: input.password,
        totp: input.totp
      },
      userId: ctx.user!!.id,
      totp: !!input.totp,
      password: !!input.password,
      alternatePassword: false
    })
    await User.update(
      {
        username: input.username
      },
      {
        where: {
          id: ctx.user!!.id
        }
      }
    )
    this.userUtilsService.emitToTrackedUsers(
      ctx.user!!.id,
      "changeUsername",
      {
        id: ctx.user!!.id,
        username: input.username
      },
      true,
      SocketNamespaces.TRACKED_USERS,
      true
    )
    return true
  }

  @RateLimit({
    window: 120,
    max: 5
  })
  @Authorization({
    scopes: "user.modify",
    emailOptional: true
  })
  @Mutation(() => Boolean)
  async changeUserEmail(
    @Arg("input") input: ChangeEmailInput,
    @Ctx() ctx: Context
  ) {
    await this.authService.validateAuthMethod({
      credentials: {
        password: input.password,
        totp: input.totp
      },
      userId: ctx.user!!.id,
      totp: !!input.totp,
      password: !!input.password,
      alternatePassword: false
    })
    await User.update(
      {
        email: input.email,
        emailVerified: !config.email.enabled,
        emailToken: null
      },
      {
        where: {
          id: ctx.user!!.id
        }
      }
    )
    await this.resendVerificationEmail(ctx)
    return true
  }

  @RateLimit({
    window: 120,
    max: 5
  })
  @Mutation(() => Boolean)
  async verifyEmail(@Arg("token") token: string) {
    await this.userUtilsService.verifyEmail(token)
    return true
  }

  @RateLimit({
    window: 10,
    max: 1
  })
  @Authorization({
    scopes: "user.modify",
    emailOptional: true
  })
  @Mutation(() => Boolean)
  async resendVerificationEmail(@Ctx() ctx: Context) {
    await this.userUtilsService.sendVerificationEmail(ctx.user!!.id)
    return true
  }

  @FieldResolver(() => [Session])
  async sessions(
    @Root() user: User,
    @Ctx() ctx: Context,
    @Arg("input", {
      nullable: true
    })
    input: SessionInput
  ) {
    if (ctx.scopes !== "*") return []
    const sessions = await user.$get(
      "sessions",
      input
        ? {
            order: [["updatedAt", "DESC"]],
            where: {
              expiredAt: {
                [Op.or]: [
                  {
                    [Op.gt]: new Date()
                  },
                  {
                    [Op.is]: null
                  }
                ]
              },
              type: input.type
            }
          }
        : {
            order: [["updatedAt", "DESC"]],
            where: {
              expiredAt: {
                [Op.or]: [
                  {
                    [Op.gt]: new Date()
                  },
                  {
                    [Op.is]: null
                  }
                ]
              }
            }
          }
    )

    return sessions.map((session) => {
      return {
        ...session.toJSON(),
        token: session.type === SessionType.API ? session.token : null
      }
    })
  }

  @FieldResolver(() => Int)
  async pendingAutoCollects(@Root() user: User) {
    return await redis.json
      .get(`autoCollects:${user.id}`)
      .then((autoCollects: AutoCollectCache[]) => {
        if (!autoCollects?.length) return 0
        return autoCollects.reduce(
          (acc, curr) => acc + curr.autoCollectApprovals.length,
          0
        )
      })
  }

  @Authorization({
    scopes: ["user.view"],
    userOptional: true
  })
  @Query(() => [PartialUserFriend])
  async trackedUsers(@Ctx() ctx: Context): Promise<PartialUserFriend[]> {
    if (!ctx.user) return []

    return this.userUtilsService.trackedUsers(ctx.user.id)
  }

  @Authorization({
    scopes: ["user.view"],
    userOptional: true
  })
  @Query(() => [Number])
  async trackedUserIds(
    @Ctx() ctx: Partial<Context>,
    regenerate = false
  ): Promise<number[]> {
    return await this.userUtilsService.trackedUserIds(ctx.user?.id, false)
  }

  @Authorization({
    scopes: ["user.view"]
  })
  @Subscription(() => StatusEvent, {
    topics: ({ context }) => {
      if (!context.user) return []
      return `USER_STATUS:${context.user.id}`
    }
  })
  onUserStatus(@Root() status: StatusEvent) {
    status.status = status.status.toLowerCase() as UserStatus
    return status
  }
}

@Resolver(PartialUserPublic)
@Service()
export class PartialUserPublicResolver extends createBaseResolver(
  "PartialUserPublic",
  PartialUserPublic
) {}

function createBaseResolver<T extends ClassType>(
  suffix: string,
  objectTypeCls: T
) {
  @Resolver(objectTypeCls)
  abstract class UserResolver {
    constructor(
      public userUtilsService: UserUtilsService,
      public authService: AuthService
    ) {}

    async findByPk(id: number, ctx: Context) {
      const user = await User.findByPk(id, {
        [EXPECTED_OPTIONS_KEY]: createContext(db),
        attributes: {
          include: ["alternatePasswords"]
        }
      })
      if (!user) return null
      if (!user.homeWidgets || user.homeWidgets.default) {
        user.homeWidgets = defaultHomeWidgets
      }
      return user
    }

    async findByUsername(username: string, ctx: Context) {
      const user = await User.findOne({
        [EXPECTED_OPTIONS_KEY]: createContext(db),
        where: {
          username
        }
      })
      return user
    }

    @FieldResolver(() => [Badge])
    async badges(@Root() user: User, @Ctx() ctx: Context) {
      if (!user) return []
      const badges = await user.$get("badges", {
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      })
      return badges
    }

    @FieldResolver(() => [Notification])
    async notifications(@Root() user: User, @Ctx() ctx: Context) {
      if (!user) return []
      return await user.$get("notifications", {
        limit: 15,
        order: [["createdAt", "DESC"]],
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      })
    }

    @FieldResolver(() => [Integration])
    async integrations(@Root() user: User, @Ctx() ctx: Context) {
      if (!user) return []
      return await user.$get("integrations", {
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      })
    }

    @FieldResolver(() => [Domain])
    async domain(@Root() user: User, @Ctx() ctx: Context) {
      if (!user) return null
      return await user.$get("domain", {
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      })
    }

    @FieldResolver(() => [SubscriptionModel])
    subscription(@Root() user: User, @Ctx() ctx: Context) {
      if (!user) return null
      return user.$get("subscription", {
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      })
    }

    @FieldResolver(() => Plan)
    async plan(@Root() user: User, @Ctx() ctx: Context) {
      if (!user) return await Plan.findByPk(1)
      return await user.$get("plan", {
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      })
    }

    @FieldResolver(() => AutoCollectRule)
    async autoCollectRules(@Root() user: User, @Ctx() ctx: Context) {
      if (!user) return []
      return await user.$get("autoCollectRules", {
        [EXPECTED_OPTIONS_KEY]: ctx.dataloader
      })
    }

    @FieldResolver(() => Stats || null)
    async stats(@Root() user: User, @Ctx() ctx: Context) {
      if (!user) return null
      const data = (await redis.json.get(`userStats:${user.id}`)) as Stats
      if (
        ctx.meta.friends !== FriendStatus.ACCEPTED &&
        ctx.user?.id !== user.id
      ) {
        data.uploadGraph = null
        data.hours = null
        data.messageGraph = null
        data.pulseGraph = null
      }
      return data
    }

    @FieldResolver(() => [Friend])
    async friends(@Root() user: User, @Ctx() ctx: Context) {
      if (!ctx.user || !user) return []
      const friends = await Friend.findAll({
        where: {
          userId: user.id,
          status: "accepted"
        },
        attributes: ["friendId"]
      })
      return await Friend.findAll({
        where: {
          userId: ctx.user.id,
          friendId: friends.map((f) => f.friendId),
          status: "accepted"
        }
      })
    }

    @FieldResolver(() => [Collection])
    async mutualCollections(@Root() user: User, @Ctx() ctx: Context) {
      if (!ctx.user || !user) return []
      return await this.userUtilsService.getMutualCollections(
        ctx.user.id,
        user.id
      )
    }

    @FieldResolver(() => FriendStatus)
    async friend(
      @Root() user: User,
      @Ctx() ctx: Context
    ): Promise<FriendStatus> {
      if (!ctx.user || !user) return FriendStatus.NONE
      return (await this.userUtilsService.getFriendStatus(
        ctx.user.id,
        user.id,
        true
      )) as FriendStatus
    }

    async findByToken(token: string | null) {
      if (!token) return null
      if (token?.startsWith("TPU-OAUTH-")) {
        const app = await OauthApp.findOne({
          where: {
            secret: token
          },
          include: [
            {
              model: User,
              as: "bot",
              required: true,
              attributes: [
                ...partialUserBase,
                "itemsPerPage",
                "status",
                "storedStatus",
                "emailVerified",
                "pulse",
                "bot",
                "banned"
              ]
            }
          ]
        })
        if (app) {
          return {
            token,
            userId: app.bot.id,
            user: app.bot as PartialUserAuth,
            scopes:
              "user.view,user.modify,uploads.view,uploads.modify,chats.view,chats.edit,chats.send,uploads.create,collections.view,collections.modify,insights.view,starred.view,starred.modify",
            type: "api",
            expiredAt: null,
            oauthAppId: app.id,
            fake: true
          }
        }
      }
      return (await Session.findOne({
        where: {
          token,
          expiredAt: {
            [Op.or]: [
              {
                [Op.gt]: new Date()
              },
              {
                [Op.is]: null
              }
            ]
          }
        },
        include: [
          {
            model: User,
            as: "user",
            required: true,
            attributes: [
              ...partialUserBase,
              "itemsPerPage",
              "status",
              "storedStatus",
              "emailVerified",
              "pulse",
              "bot",
              "banned"
            ]
          }
        ]
      })) as Session & {
        user: PartialUserAuth
      }
    }
  }
  return UserResolver
}

@Resolver(PartialUserFriend)
@Service()
export class PartialUserFriendResolver {
  @FieldResolver(() => FriendNickname)
  nickname(@Root() user: User, @Ctx() ctx: Context) {
    if (!ctx.user?.id || !user) return null
    return user.$get("nickname", {
      where: {
        userId: ctx.user?.id
      }
    })
  }

  @FieldResolver(() => Boolean, {
    nullable: true
  })
  async blocked(@Ctx() ctx: Context, @Root() user: User) {
    if (!ctx.user?.id || !user) return false
    const blocks =
      ctx.meta.blocks ||
      (await BlockedUser.findAll({
        where: {
          userId: ctx.user.id
        }
      }))
    return blocks.some((b: BlockedUser) => b.blockedUserId === user.id)
  }
}

@Resolver(Badge)
@Service()
export class BadgeResolver {
  @FieldResolver(() => User)
  async users(@Root() badge: Badge, @Ctx() ctx: Context) {
    return badge.$get("users", {
      [EXPECTED_OPTIONS_KEY]: ctx.dataloader
    })
  }
}

@Resolver(PartialUserBase)
@Service()
export class PartialUserBaseResolver extends createBaseResolver(
  "PartialUserBase",
  PartialUserBase
) {
  @FieldResolver(() => Boolean)
  legacy() {
    return false
  }
}
