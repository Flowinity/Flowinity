import { expect } from "@jest/globals"

export const messageExpectations = {
  attachments: expect.any(Array),
  associationId: expect.any(Number),
  chat: {
    id: expect.any(Number),
    name: expect.any(String),
    recipient: {
      administrator: expect.any(Boolean),
      avatar: expect.anything(),
      bot: expect.any(Boolean),
      createdAt: expect.any(String),
      id: expect.any(Number),
      legacyUser: expect.any(Boolean),
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
    editedAt: expect.any(Number),
    embeds: expect.any(Array),
    emoji: expect.any(Array),
    id: expect.any(Number),
    legacyUserId: expect.anything(),
    pending: expect.anything(),
    pinned: expect.any(Boolean),
    readReceipts: expect.any(Array),
    reply: expect.anything(),
    replyId: expect.anything(),
    tpuUser: {
      avatar: expect.anything(),
      bot: expect.any(Boolean),
      id: expect.any(Number),
      username: expect.any(String)
    },
    type: expect.any(String),
    updatedAt: expect.any(String),
    user: {
      avatar: expect.any(),
      bot: expect.any(Boolean),
      id: expect.any(Number),
      username: expect.any(String)
    },
    userId: expect.any(Number)
  }
}
