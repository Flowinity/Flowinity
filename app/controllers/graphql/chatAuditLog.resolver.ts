import { Arg, Ctx, Query, Resolver } from "type-graphql"
import { Service } from "typedi"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { Context } from "@app/types/graphql/context"
import { AuditLogInput } from "@app/classes/graphql/chat/auditLog/getAuditLog"
import { ChatService } from "@app/services/chat.service"
import { PagerResponse } from "@app/classes/graphql/gallery/galleryResponse"
import { ChatAuditLog } from "@app/models/chatAuditLog.model"
import { ChatPermissions } from "@app/classes/graphql/chat/ranks/permissions"
import paginate from "jw-paginate"

export const PaginatedAuditLogResponse = PagerResponse(ChatAuditLog)
export type PaginatedAuditLogResponse = InstanceType<
  typeof PaginatedAuditLogResponse
>

@Resolver(AutoCollectApproval)
@Service()
export class ChatAuditLogResolver {
  constructor(private chatService: ChatService) {}

  @Authorization({
    scopes: ["chats.view"]
  })
  @Query(() => PaginatedAuditLogResponse)
  async chatAuditLog(
    @Ctx() ctx: Context,
    @Arg("input") input: AuditLogInput
  ): Promise<PaginatedAuditLogResponse> {
    const chat = await this.chatService.getChatFromAssociation(
      input.associationId,
      ctx.user!!.id
    )
    await this.chatService.checkPermissions(
      ctx.user!!.id,
      input.associationId,
      ChatPermissions.VIEW_AUDIT_LOG
    )
    const offset = input.page * input.limit - input.limit || 0
    const items = await ChatAuditLog.findAll({
      where: {
        chatId: chat.id
      },
      offset,
      limit: input.limit,
      order: [["createdAt", "DESC"]]
    })
    const entries = await ChatAuditLog.count({
      where: {
        chatId: chat.id
      }
    })
    const pager = paginate(entries, input.page, input.limit)
    return {
      items,
      pager
    }
  }
}
