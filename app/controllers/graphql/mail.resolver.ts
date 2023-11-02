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
import { GetMailInput, ListResponse } from "@app/classes/graphql/mail/mailbox"
import { GraphQLJSON } from "graphql-scalars"

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
  @Query(() => Int)
  async unreadMail(@Ctx() ctx: Context) {
    try {
      return await this.mailService.getUnread(ctx.user!!.id)
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  @Authorization({
    scopes: "mail.view"
  })
  @Query(() => GraphQLJSON)
  async getMail(@Ctx() ctx: Context, @Arg("input") input: GetMailInput) {
    return await this.mailService.getMessages(
      ctx.user!!.id,
      input.mailbox,
      input.page
    )
  }
}
