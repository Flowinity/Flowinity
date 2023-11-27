import { Arg, Ctx, Mutation, Resolver } from "type-graphql"
import { Service } from "typedi"
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
    let user1 = await User.findByPk(1, {
      [EXPECTED_OPTIONS_KEY]: ctx.dataloader
    })
    let user2 = await User.findByPk(6, {
      [EXPECTED_OPTIONS_KEY]: ctx.dataloader
    })
    console.log(user1?.username, user2?.username)
    return { success: true }
  }
}
