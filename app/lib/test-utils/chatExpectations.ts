import { expect } from "@jest/globals"

export const messageExpectations = {
  associationId: expect.any(Number),
  chat: {
    id: expect.any(Number),
    name: expect.any(String),
    recipient: {
      administrator: expect.any(Boolean),
      bot: expect.any(Boolean),
      createdAt: expect.any(String),
      id: expect.any(Number),
      moderator: expect.any(Boolean),
      username: expect.any(String)
    },
    type: expect.any(String)
  },
  mention: expect.any(Boolean),
  message: {
    chatId: expect.any(Number),
    content: expect.any(String),
    createdAt: expect.any(String),
    edited: expect.any(Boolean),
    embeds: expect.any(Array),
    emoji: expect.any(Array),
    id: expect.any(Number),
    pinned: expect.any(Boolean),
    readReceipts: expect.any(Array),
    tpuUser: {
      bot: expect.any(Boolean),
      id: expect.any(Number),
      username: expect.any(String)
    },
    type: expect.any(String),
    updatedAt: expect.any(String),
    user: {
      bot: expect.any(Boolean),
      id: expect.any(Number),
      username: expect.any(String)
    },
    userId: expect.any(Number)
  }
}
