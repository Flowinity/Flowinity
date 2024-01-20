import { beforeAll, expect, test, describe } from "@jest/globals"
import { gCall } from "@app/lib/test-utils/gCall"
import { RegisterMutation } from "../../../frontend/src/graphql/auth/register.graphql"
import { LoginMutation } from "../../../frontend/src/graphql/auth/login.graphql"
import cryptoRandomString from "crypto-random-string"
import "@app/lib/init-tests"
// REQUIRED IMPORT TO COUNT CODE COVERAGE
import { ChatResolver } from "@app/controllers/graphql/chat.resolver"
import { ChatAssociationResolver } from "@app/controllers/graphql/chatAssociation.resolver"
import { ChatRankResolver } from "@app/controllers/graphql/chatRank.resolver"
import { MessageResolver } from "@app/controllers/graphql/message.resolver"
import { ChatControllerV3 } from "@app/controllers/v3/chat.controller"
import { resetState } from "@app/lib/init-tests"
import { getUser, TestUser } from "@app/lib/test-utils/testUser"
import { Socket } from "socket.io-client"
import supertest from "supertest"
import { Container } from "typedi"
import { Application } from "@app/app"
import {
  connectSocket,
  waitForSocketEvent
} from "@app/lib/test-utils/socketHelper"
import { CreateChatMutation } from "../../../frontend-v5/src/graphql/chats/createChat.graphql"
import { errorConverter } from "@app/lib/test-utils/errorConverter"
import { AddFriendMutation } from "../../../frontend-v5/src/graphql/friends/addFriend.graphql"
import { SendMessageMutation } from "../../../frontend-v5/src/graphql/chats/sendMessage.graphql"
import { messageExpectations } from "@app/lib/test-utils/chatExpectations"
import { ChatsQuery } from "../../../frontend-v5/src/graphql/chats/chats.graphql"
import {
  MessagesQuery,
  PagedMessagesQuery
} from "../../../frontend-v5/src/graphql/chats/messages.graphql"

const users: {
  [key: string]: {
    user: TestUser | null
    socketClient: Socket | null
    assocId: number
  }
} = {
  normal: {
    user: null,
    socketClient: null,
    assocId: 0
  },
  groupAdmin: {
    user: null,
    socketClient: null,
    assocId: 0
  },
  groupOwner: {
    user: null,
    socketClient: null,
    assocId: 0
  }
}
let req: supertest.SuperTest<supertest.Test> | null = null
let msgId = 0

describe("ChatResolver", () => {
  test("Create direct message between users without being friends", async () => {
    const dm = await gCall({
      source: CreateChatMutation,
      token: users.normal.user!.token,
      variableValues: {
        input: {
          users: [users.groupAdmin.user!.id]
        }
      }
    })
    expect(dm.errors).toMatchObject([
      errorConverter(undefined, "INVALID_FRIEND_SELECTION")
    ])
  })

  test("Create direct message between users", async () => {
    const addFriend = await gCall({
      source: AddFriendMutation,
      token: users.normal.user!.token,
      variableValues: {
        input: {
          userId: users.groupAdmin.user!.id
        }
      }
    })
    const acceptFriend = await gCall({
      source: AddFriendMutation,
      token: users.groupAdmin.user!.token,
      variableValues: {
        input: {
          userId: users.normal.user!.id
        }
      }
    })
    expect(addFriend.errors).toBeUndefined()
    expect(addFriend.data?.friend).toBe(true)
    expect(acceptFriend.errors).toBeUndefined()
    expect(acceptFriend.data?.friend).toBe(true)

    const wait1 = waitForSocketEvent(
      users.normal.socketClient,
      "chatCreated",
      1000,
      (data) => {
        expect(data).toMatchObject({
          id: expect.any(Number),
          name: "Direct Message",
          association: {
            id: expect.any(Number)
          }
        })
        users.normal.assocId = data.association.id
      }
    )

    const wait2 = waitForSocketEvent(
      users.groupAdmin.socketClient,
      "chatCreated",
      1000,
      (data) => {
        expect(data).toMatchObject({
          id: expect.any(Number),
          name: "Direct Message",
          association: {
            id: expect.any(Number)
          }
        })
        users.groupAdmin.assocId = data.association.id
      }
    )

    const dm = await gCall({
      source: CreateChatMutation,
      token: users.normal.user!.token,
      variableValues: {
        input: {
          users: [users.groupAdmin.user!.id]
        }
      }
    })
    await wait1
    await wait2
    expect(dm.errors).toBeUndefined()
    expect(dm.data?.createChat).toMatchObject({
      id: expect.any(Number),
      association: {
        id: expect.any(Number)
      }
    })
  })

  test("Send message to direct message", async () => {
    const wait1 = waitForSocketEvent(
      users.normal.socketClient,
      "message",
      1000,
      (data) => {
        expect(data).toMatchObject(messageExpectations)
      }
    )
    const wait2 = waitForSocketEvent(
      users.groupAdmin.socketClient,
      "message",
      1000,
      (data) => {
        expect(data).toMatchObject(messageExpectations)
      }
    )
    const message = await gCall({
      source: SendMessageMutation,
      token: users.normal.user!.token,
      variableValues: {
        input: {
          associationId: users.normal.assocId,
          content: "sup",
          attachments: []
        }
      }
    })
    await wait1
    await wait2
    expect(message.errors).toBeUndefined()
    expect(message.data?.sendMessage).toMatchObject({
      id: expect.any(Number)
    })
    msgId = message.data?.sendMessage.id
  })

  test("Reply to message", async () => {
    const wait1 = waitForSocketEvent(
      users.normal.socketClient,
      "message",
      1000,
      (data) => {
        expect(data).toMatchObject({
          ...messageExpectations,
          message: {
            ...messageExpectations.message,
            content: "sup with you",
            replyId: msgId,
            reply: {
              id: msgId,
              content: "sup"
            }
          }
        })
      }
    )
    const wait2 = waitForSocketEvent(
      users.groupAdmin.socketClient,
      "message",
      1000,
      (data) => {
        expect(data).toMatchObject({
          ...messageExpectations,
          message: {
            ...messageExpectations.message,
            content: "sup with you",
            replyId: msgId,
            reply: {
              id: msgId,
              content: "sup"
            }
          }
        })
      }
    )
    const message = await gCall({
      source: SendMessageMutation,
      token: users.groupAdmin.user!.token,
      variableValues: {
        input: {
          associationId: users.groupAdmin.assocId,
          content: "sup with you",
          attachments: [],
          replyId: msgId
        }
      }
    })
    await wait1
    await wait2
    expect(message.errors).toBeUndefined()
    expect(message.data?.sendMessage).toMatchObject({
      id: expect.any(Number)
    })
    msgId = message.data?.sendMessage.id
  })

  test("Edit message (legacy)", async () => {
    const wait1 = waitForSocketEvent(
      users.normal.socketClient,
      "edit",
      1000,
      (data) => {
        expect(data).toMatchObject({
          content: "sup with you?",
          id: msgId
        })
      }
    )
    const wait2 = waitForSocketEvent(
      users.groupAdmin.socketClient,
      "edit",
      1000,
      (data) => {
        expect(data).toMatchObject({
          content: "sup with you?",
          id: msgId
        })
      }
    )
    const message = await req!
      .put(`/api/v3/chats/${users.groupAdmin.assocId}/message`)
      .send({
        id: msgId,
        content: "sup with you?"
      })
      .set("Authorization", users.groupAdmin.user!.token)
    await wait1
    await wait2
    expect(message.statusCode).toBe(204)
  })

  test("Get chats", async () => {
    const chats = await gCall({
      source: ChatsQuery,
      token: users.normal.user!.token
    })
    expect(chats.errors).toBeUndefined()
    const find = chats.data?.chats.find(
      (c: any) => c.association.id === users.normal.assocId
    )
    expect(find).toBeDefined()

    const chats2 = await gCall({
      source: ChatsQuery,
      token: users.groupAdmin.user!.token
    })
    expect(chats2.errors).toBeUndefined()
    const find2 = chats2.data?.chats.find(
      (c: any) => c.association.id === users.groupAdmin.assocId
    )
    expect(find2).toBeDefined()
  })

  test("Get chats (legacy)", async () => {
    const chats = await req!
      .get("/api/v3/chats")
      .set("Authorization", users.groupAdmin.user!.token)

    const find = chats.body.find(
      (c: any) => c.association.id === users.groupAdmin.assocId
    )
    expect(find).toBeDefined()

    const chats2 = await req!
      .get("/api/v3/chats")
      .set("Authorization", users.normal.user!.token)

    const find2 = chats2.body.find(
      (c: any) => c.association.id === users.normal.assocId
    )
    expect(find2).toBeDefined()
  })

  test("Get messages (infinite, top, init)", async () => {
    const messages = await gCall({
      source: MessagesQuery,
      token: users.normal.user!.token,
      variableValues: {
        input: {
          associationId: users.normal.assocId,
          position: "TOP"
        }
      }
    })
    expect(messages.errors).toBeUndefined()
    expect(messages.data?.messages[0]).toMatchObject({
      id: expect.any(Number),
      content: "sup with you?"
    })
  })

  test("Get messages (paginated)", async () => {
    const messages = await gCall({
      source: PagedMessagesQuery,
      token: users.normal.user!.token,
      variableValues: {
        input: {
          associationId: users.normal.assocId,
          position: "BOTTOM",
          page: 1
        }
      }
    })
    expect(messages.errors).toBeUndefined()
    expect(messages.data.messagesPaged.items[0]).toMatchObject({
      id: expect.any(Number),
      content: "sup with you?"
    })
    expect(messages.data.messagesPaged.pager.totalItems).toBe(2)
  })

  test("Get messages (legacy)", async () => {
    const messages = await req!
      .get(`/api/v3/chats/${users.normal.assocId}/messages`)
      .set("Authorization", users.normal.user!.token)
    expect(messages.body[0]).toMatchObject({
      id: expect.any(Number),
      content: "sup with you?"
    })
  })

  test("Create group", async () => {
    // friend the third user
    const addFriend = await gCall({
      source: AddFriendMutation,
      token: users.normal.user!.token,
      variableValues: {
        input: {
          userId: users.groupOwner.user!.id
        }
      }
    })
    const acceptFriend = await gCall({
      source: AddFriendMutation,
      token: users.groupOwner.user!.token,
      variableValues: {
        input: {
          userId: users.normal.user!.id
        }
      }
    })
    const addFriend2 = await gCall({
      source: AddFriendMutation,
      token: users.groupAdmin.user!.token,
      variableValues: {
        input: {
          userId: users.groupOwner.user!.id
        }
      }
    })
    const acceptFriend2 = await gCall({
      source: AddFriendMutation,
      token: users.groupOwner.user!.token,
      variableValues: {
        input: {
          userId: users.groupAdmin.user!.id
        }
      }
    })
    expect(addFriend.errors).toBeUndefined()
    expect(addFriend.data?.friend).toBe(true)
    expect(acceptFriend.errors).toBeUndefined()
    expect(acceptFriend.data?.friend).toBe(true)
    expect(addFriend2.errors).toBeUndefined()
    expect(addFriend2.data?.friend).toBe(true)
    expect(acceptFriend2.errors).toBeUndefined()
    expect(acceptFriend2.data?.friend).toBe(true)

    const wait1 = waitForSocketEvent(
      users.normal.socketClient,
      "chatCreated",
      1000,
      (data) => {
        expect(data).toMatchObject({
          id: expect.any(Number),
          name: "Unnamed Group",
          association: {
            id: expect.any(Number)
          }
        })
        expect(data.users.length).toBe(3)
        users.normal.assocId = data.association.id
      }
    )
    const wait2 = waitForSocketEvent(
      users.groupAdmin.socketClient,
      "chatCreated",
      1000,
      (data) => {
        expect(data).toMatchObject({
          id: expect.any(Number),
          name: "Unnamed Group",
          association: {
            id: expect.any(Number)
          }
        })
        expect(data.users.length).toBe(3)
        users.groupAdmin.assocId = data.association.id
      }
    )

    const wait3 = waitForSocketEvent(
      users.groupOwner.socketClient,
      "chatCreated",
      1000,
      (data) => {
        expect(data).toMatchObject({
          id: expect.any(Number),
          name: "Unnamed Group",
          association: {
            id: expect.any(Number)
          }
        })
        expect(data.users.length).toBe(3)
        users.groupOwner.assocId = data.association.id
      }
    )

    const group = await gCall({
      source: CreateChatMutation,
      token: users.groupOwner.user!.token,
      variableValues: {
        input: {
          users: [users.groupAdmin.user!.id, users.normal.user!.id]
        }
      }
    })

    await wait1
    await wait2
    await wait3

    expect(group.errors).toBeUndefined()
    expect(group.data?.createChat).toMatchObject({
      id: expect.any(Number)
    })
  })
})

beforeAll(async () => {
  await resetState()
  const app = Container.get(Application)
  req = supertest(app.app)
  const n = await getUser()
  users.normal = {
    user: n,
    socketClient: await connectSocket("/chat", n!.token).then((s) => {
      return s.socketClient
    }),
    assocId: 0
  }

  const register1 = await gCall({
    source: RegisterMutation,
    variableValues: {
      input: {
        username: cryptoRandomString({ length: 10, type: "alphanumeric" }),
        email:
          cryptoRandomString({ length: 10, type: "alphanumeric" }) +
          "@test.com",
        password: "password12345678!"
      }
    }
  })

  const register2 = await gCall({
    source: RegisterMutation,
    variableValues: {
      input: {
        username: cryptoRandomString({ length: 10, type: "alphanumeric" }),
        email:
          cryptoRandomString({ length: 10, type: "alphanumeric" }) +
          "@test.com",
        password: "password12345678!"
      }
    }
  })

  users.groupAdmin = {
    user: await getUser(register1.data?.register?.user?.id),
    socketClient: await connectSocket(
      "/chat",
      register1.data?.register?.token
    ).then((s) => {
      return s.socketClient
    }),
    assocId: 0
  }

  users.groupOwner = {
    user: await getUser(register2.data?.register?.user?.id),
    socketClient: await connectSocket(
      "/chat",
      register2.data?.register?.token
    ).then((s) => {
      return s.socketClient
    }),
    assocId: 0
  }

  await new Promise((r) => setTimeout(r, 50))
})
