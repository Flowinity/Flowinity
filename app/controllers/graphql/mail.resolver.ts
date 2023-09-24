import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { GraphQLError } from "graphql/error"
import { MailService } from "@app/services/mail.service"
import { ListResponse } from "@app/classes/graphql/mail/mailbox"

@Resolver()
@Service()
export class MailResolver {
  constructor(private mailService: MailService) {}

  @Authorization({
    scopes: "mail.view"
  })
  @Query(() => [ListResponse])
  async mailboxes(@Ctx() ctx: Context) {
    return await this.mailService.getMailboxes(ctx.user!!.id)
  }

  @Authorization({
    scopes: "mail.view"
  })
  @Query(() => Number)
  async unreadMail(@Ctx() ctx: Context) {}
}
