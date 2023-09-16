import {
  ConnectedSocket,
  EmitOnSuccess,
  MessageBody,
  OnConnect,
  OnMessage,
  SocketController
} from "socket-controllers"
import { Container, Service } from "typedi"
import { ChatService } from "@app/services/chat.service"
import { SocketAuth } from "@app/types/socket"
import { SocketAuthMiddleware } from "@app/lib/socket-auth"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"

@SocketController("/chat")
@Service()
export class ChatSocketController {
  constructor(
    private chatService: ChatService,
    private userResolver: UserResolver,
    private socketAuthMiddleware: SocketAuthMiddleware
  ) {}

  @OnConnect()
  async onConnect(@ConnectedSocket() socket: SocketAuth) {
    const session = await this.socketAuthMiddleware.use(
      socket,
      () => {},
      SocketNamespaces.CHAT
    )
    if (session) {
      socket.join(session.user.id)
    } else {
      socket.disconnect(true)
    }
  }

  @OnMessage("readChat")
  async readChat(
    @ConnectedSocket() socket: SocketAuth,
    @MessageBody() data: number
  ) {
    await this.chatService.readChat(data, socket.request.user.id)
  }

  @OnMessage("typing")
  @EmitOnSuccess("typing")
  async typing(
    @ConnectedSocket() socket: SocketAuth,
    @MessageBody() data: { associationId: number }
  ) {
    const typingRateLimit = await redis.get(
      `user:${socket.request.user.id}:typing`
    )

    if (
      typingRateLimit &&
      dayjs().isBefore(dayjs(typingRateLimit).add(2, "second"))
    )
      return

    const chatService: ChatService = Container.get(ChatService)

    await chatService.typing(data.associationId, socket.request.user.id)

    await redis.set(
      `user:${socket.request.user.id}:typing`,
      new Date().toISOString(),
      "EX",
      2
    )
  }
}
