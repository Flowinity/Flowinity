import { describe, expect, jest, test } from "@jest/globals"
import "reflect-metadata"
import type { SocketServerWithUser } from "@app/types/global"

const mockPublish = jest.fn()

jest.mock("@app/lib/graphql/pubsub", () => ({
  pubSub: {
    publish: mockPublish
  }
}))

jest.mock("@app/classes/graphql/SocketEvents", () => ({
  SocketNamespaces: {
    TRACKED_USERS: "/trackedUsers"
  }
}))

jest.mock("@app/classes/graphql/user/status", () => ({
  UserStatus: {
    OFFLINE: "offline"
  },
  UserStoredStatus: {
    INVISIBLE: "invisible"
  }
}))

jest.mock("argon2", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    verify: jest.fn()
  }
}))

const { UserUtilsService } = require("./userUtils.service")

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((res, _rej) => {
    resolve = res
  })
  return { promise, resolve }
}

describe("UserUtilsService", () => {
  test("emits tracked user status after pubsub publish resolves", async () => {
    const service = new UserUtilsService()
    const pending = deferred<void>()
    const socketEmit = jest.fn()
    const socketTo = jest.fn(() => ({ emit: socketEmit }))
    const socketOf = jest.fn(() => ({ to: socketTo }))
    const originalSocket = global.socket
    const mockSocket = {
      of: socketOf
    } as unknown as SocketServerWithUser

    try {
      global.socket = mockSocket

      jest.spyOn(service, "trackedUserIds").mockResolvedValue([7])
      jest.spyOn(service, "blocked").mockResolvedValue(null)
      mockPublish.mockReturnValueOnce(pending.promise)

      const result = service.emitToTrackedUsers(
        1,
        "userStatus",
        {
          id: 1,
          status: "OFFLINE"
        },
        false
      )

      await new Promise((resolve) => setImmediate(resolve))

      expect(mockPublish).toHaveBeenCalledWith("USER_STATUS:7", {
        id: 1,
        status: "OFFLINE"
      })
      expect(socketEmit).not.toHaveBeenCalled()

      pending.resolve()
      await result

      expect(socketOf).toHaveBeenCalledWith("/trackedUsers")
      expect(socketTo).toHaveBeenCalledWith(7)
      expect(socketEmit).toHaveBeenCalledWith("userStatus", {
        id: 1,
        status: "OFFLINE"
      })
    } finally {
      global.socket = originalSocket
    }
  })
})
