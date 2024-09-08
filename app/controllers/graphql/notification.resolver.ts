import { Ctx, FieldResolver, Mutation, Resolver, Root } from "type-graphql"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import { Notification } from "@app/models/notification.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { User } from "@app/models/user.model"

@Resolver(Notification)
@Service()
export class NotificationResolver {
  @Authorization({
    scopes: ["user.modify"]
  })
  @Mutation(() => [Notification])
  async markNotificationsAsRead(@Ctx() ctx: Context) {
    await Notification.update(
      {
        dismissed: true
      },
      {
        where: {
          userId: ctx.user!.id
        }
      }
    )
    return await Notification.findAll({
      where: {
        userId: ctx.user!.id
      },
      limit: 15,
      order: [["createdAt", "DESC"]]
    })
  }

  @FieldResolver(() => User)
  user(@Root() notification: Notification) {
    return User.findByPk(notification.userId)
  }
}
