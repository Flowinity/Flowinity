import { describe, expect, jest, test } from "@jest/globals"
import "reflect-metadata"
const mockPublish: jest.MockedFunction<
  (key: string, value: unknown) => Promise<void>
> = jest.fn()

jest.mock("@app/lib/graphql/pubsub", () => ({
  pubSub: {
    publish: mockPublish
  }
}))

jest.mock("@app/classes/graphql/SocketEvents", () => ({
  SocketNamespaces: {
    TRACKED_USERS: "/trackedUsers",
    USER: "/user"
  }
}))

jest.mock("@app/classes/graphql/user/status", () => ({
  UserStatus: {
    ONLINE: "online",
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
const { User } = require("@app/models/user.model")
const { SocketNamespaces } = require("@app/classes/graphql/SocketEvents")
const { UserStatus } = require("@app/classes/graphql/user/status")

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

describe("UserUtilsService", () => {
  test("emits user settings before tracked user emission resolves", async () => {
    const service = new UserUtilsService()
    const pending = deferred<void>()
    const socketEmit = jest.fn()
    const socketTo = jest.fn(() => ({ emit: socketEmit }))
    const socketOf = jest.fn(() => ({ to: socketTo }))
    const originalSocket = global.socket
    const emitToTrackedUsers = jest
      .spyOn(service, "emitToTrackedUsers")
      .mockReturnValueOnce(pending.promise)
    const updateSpy = jest.spyOn(User, "update").mockResolvedValue([1] as never)

    try {
      global.socket = {
        of: socketOf
      } as unknown as typeof global.socket

      const result = service.updateTempUserStatus(1, UserStatus.ONLINE)

      await Promise.resolve()

      expect(emitToTrackedUsers).toHaveBeenCalledWith(
        1,
        "userStatus",
        {
          id: 1,
          status: "ONLINE"
        },
        true
      )
      expect(socketOf).toHaveBeenCalledWith(SocketNamespaces.USER)
      expect(socketTo).toHaveBeenCalledWith(1)
      expect(socketEmit).toHaveBeenCalledWith("userSettingsUpdate", {
        status: "ONLINE"
      })

      pending.resolve()
      await result
    } finally {
      global.socket = originalSocket
      emitToTrackedUsers.mockRestore()
      updateSpy.mockRestore()
    }
  })
})
