import {afterAll, expect, test} from "@jest/globals"
import "../lib/init-tests"
import {ChatService} from "@app/services/chat.service"
import {Container} from "typedi"
import {ChatControllerV3} from "@app/controllers/v3/chat.controller"
import {Chat} from "@app/models/chat.model"

const chatService = Container.get(ChatService)
const chatController = Container.get(ChatControllerV3)

test("Get chats", async () => {
    const user = await authMock(1, "chats.view", false)
    if (!user) throw new Error("User not found")
    const messages = await chatController.getChats(user)
    expect(Array.isArray([messages])).toBe(true)
})

test("Get messages", async () => {
    const user = await authMock(1, "messages.view", false)
    if (!user) throw new Error("User not found")
    const messages = await chatController.getMessages(user, 1)
    expect(Array.isArray([messages])).toBe(true)
})

test("Create chat", async () => {
    const user = await authMock(1, "chats.create", false)
    if (!user) throw new Error("User not found")
    const chat = await chatController.createChat(user, {
        users: [6, 5]
    })
    expect(chat).toHaveProperty("id")

    const messages = await chatController.getMessages(user, chat.id)
    expect(Array.isArray([messages])).toBe(true)

    let chats = await chatController.getChats(user)
    const newChat = chats.find((c: Chat) => c.id === chat.id)
    expect(newChat).toHaveProperty("id")

    chats = await chatController.getChats(authMock(6, "chats.view", false))
    const newChat2 = chats.find((c: Chat) => c.id === chat.id)
    expect(newChat2).toHaveProperty("id")
})

afterAll(async () => {
    await redis.disconnect()
    await db.close()
})
