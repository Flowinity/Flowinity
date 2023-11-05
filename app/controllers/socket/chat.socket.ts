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

  private nsp = SocketNamespaces.CHAT

  @OnConnect()
  async onConnect(@ConnectedSocket() socket: SocketAuth) {
    const session = await this.socketAuthMiddleware.use(
      socket,
      () => {},
      this.nsp
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
    if (!socket.request.user[this.nsp]) return
    await this.chatService.readChat(data, socket.request.user[this.nsp].id)
  }

  @OnMessage("typing")
  async typing(
    @ConnectedSocket() socket: SocketAuth,
    @MessageBody() data: number
  ) {
    if (!socket.request.user[this.nsp]) return
    const typingRateLimit = await redis.get(
      `user:${socket.request.user[this.nsp].id}:typing`
    )
    if (
      typingRateLimit &&
      dayjs().isBefore(dayjs(typingRateLimit).add(2, "second"))
    )
      return

    const chatService: ChatService = Container.get(ChatService)

    await chatService.typing(
      data,
      socket.request.user[this.nsp].id,
      socket.handshake.query.version === "5"
    )

    await redis.set(
      `user:${socket.request.user[this.nsp].id}:typing`,
      new Date().toISOString(),
      {
        EX: 2
      }
    )
  }

  @OnMessage("cancelTyping")
  async cancelTyping(
    @ConnectedSocket() socket: SocketAuth,
    @MessageBody() data: number
  ) {
    if (!socket.request.user[this.nsp]) return
    await redis.del(`user:${socket.request.user[this.nsp].id}:typing`)
    const chatService: ChatService = Container.get(ChatService)
    await chatService.cancelTyping(
      data,
      socket.request.user[this.nsp].id,
      socket.handshake.query.version === "5"
    )
  }
}
