import { beforeAll, expect, test } from "@jest/globals"
import "@app/lib/init-tests"
import { gCall } from "@app/lib/test-utils/gCall"
import { RegisterMutation } from "../../../frontend/src/graphql/auth/register.graphql"
import { LoginMutation } from "../../../frontend/src/graphql/auth/login.graphql"
import { ECoreStateQuery } from "../../../frontend/src/graphql/core/state.graphql"
import cryptoRandomString from "crypto-random-string"
import { ProfileQuery } from "../../../frontend/src/graphql/user/profile.graphql"
import { User } from "@app/models/user.model"
import {
  SendEmailVerificationMutation,
  VerifyEmailMutation
} from "../../../frontend-v5/src/graphql/user/verifyEmail.graphql"
import { SessionsQuery } from "../../../frontend-v5/src/graphql/user/sessions.graphql"
import { UpdateUserMutation } from "../../../frontend/src/graphql/user/update.graphql"
import { UpdateUserStatusMutation } from "../../../frontend-v5/src/graphql/user/update.graphql"
import { UserStoredStatus } from "../../../frontend/src/gql/graphql"
import {
  ChangeUserEmailMutation,
  ChangeUserPasswordMutation
} from "../../../frontend/src/graphql/user/changeUsername.graphql"
import { getUser, TestUser } from "@app/lib/test-utils/testUser"
import { errorConverter } from "@app/lib/test-utils/errorConverter"
import { resetState } from "@app/lib/init-tests"
import { AdminService } from "@app/services/admin.service"

let user: TestUser | null = null
let token = ""

describe("UserResolver", () => {
  test("Get user and test token", async () => {
    const state = await gCall({
      source: ECoreStateQuery,
      token
    })
    console.log(JSON.stringify(state.errors, null, 2))
    expect(state.errors).toBeUndefined()
    expect(state).toMatchObject({
      data: {
        coreState: {
          name: "Flowinity"
        },
        currentUser: {
          id: user!.id,
          username: user!.username,
          email: user!.email
        }
      }
    })
  })

  test("Send email verification", async () => {
    const data = await gCall({
      source: SendEmailVerificationMutation,
      token
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.resendVerificationEmail).toBe(true)
  })

  test("Change email address while unverified", async () => {
    jest.spyOn(AdminService.prototype, "sendEmail").mockImplementation(() => {
      return Promise.resolve(true)
    })

    const newEmail = `${cryptoRandomString({
      length: 10,
      type: "alphanumeric"
    })}@test.com`
    const data = await gCall({
      source: ChangeUserEmailMutation,
      token,
      variableValues: {
        input: {
          email: newEmail,
          password: "password12345678!"
        }
      }
    })
    expect(data.errors).toBeUndefined()
    expect(data.data.changeUserEmail).toBe(true)

    const data2 = await gCall({
      source: ECoreStateQuery,
      token
    })
    expect(data2.errors).toBeUndefined()
    expect(data2.data.currentUser.email).toBe(newEmail)
    user!.email = newEmail
  })

  test("Verify email address", async () => {
    const u = await User.findOne({
      where: {
        id: user?.id
      },
      attributes: ["id", "emailVerified", "emailToken"]
    })

    console.log(u)

    if (u?.emailVerified) {
      console.log("Email already verified")
      expect(u.emailVerified).toBe(true)
    } else {
      jest
        .spyOn(AdminService.prototype, "sendEmail")
        .mockImplementation(() => Promise.resolve(true))
      const data = await gCall({
        source: VerifyEmailMutation,
        variableValues: {
          token: u?.emailToken || ""
        },
        token
      })
      expect(data.errors).toBeUndefined()
      expect(data.data.verifyEmail).toBe(true)
    }
  })

  test("Get public user profile", async () => {
    const state = await gCall({
      source: ProfileQuery,
      token,
      variableValues: {
        input: {
          id: user!.id
        }
      }
    })
    console.log(JSON.stringify(state.errors, null, 2))
    expect(state.errors).toBeUndefined()
    expect(state).toMatchObject({
      data: {
        user: {
          id: user!.id,
          username: user!.username
        }
      }
    })
  })

  test("Get sessions", async () => {
    const state = await gCall({
      source: SessionsQuery,
      token
    })
    console.log(JSON.stringify(state.errors, null, 2))
    expect(state.errors).toBeUndefined()
    expect(state.data.currentUser.sessions).toBeDefined()
  })

  test("Update user", async () => {
    const state = await gCall({
      source: UpdateUserMutation,
      token,
      variableValues: {
        input: {
          publicProfile: true
        }
      }
    })
    expect(state.errors).toBeUndefined()
    expect(state.data.updateUser).toBe(true)

    const state2 = await gCall({
      source: ECoreStateQuery,
      token
    })
    expect(state2.errors).toBeUndefined()
    expect(state2.data.currentUser.publicProfile).toBe(true)
  })

  test("Test public profiles", async () => {
    const state = await gCall({
      source: ProfileQuery,
      variableValues: {
        input: {
          id: user!.id
        }
      }
    })
    console.log(state.data.user)
    expect(state.errors).toBeUndefined()
    expect(state.data.user.publicProfile).toBe(true)
  })

  test("Unset public profile", async () => {
    const state = await gCall({
      source: UpdateUserMutation,
      token,
      variableValues: {
        input: {
          publicProfile: false
        }
      }
    })
    expect(state.errors).toBeUndefined()
    expect(state.data.updateUser).toBe(true)
  })

  test("Test private profiles", async () => {
    const state = await gCall({
      source: ProfileQuery,
      variableValues: {
        input: {
          id: user!.id
        }
      }
    })
    expect(state.errors).toBeDefined()
    expect(state.data.user).toBeNull()
  })

  test("Update status", async () => {
    const state = await gCall({
      source: UpdateUserStatusMutation,
      token,
      variableValues: {
        input: {
          storedStatus: UserStoredStatus.Busy
        }
      }
    })
    expect(state.errors).toBeUndefined()
    expect(state.data.updateStatus).toBe(UserStoredStatus.Busy)

    // Set back to online
    const state2 = await gCall({
      source: UpdateUserStatusMutation,
      token,
      variableValues: {
        input: {
          storedStatus: UserStoredStatus.Online
        }
      }
    })
    expect(state2.errors).toBeUndefined()
    expect(state2.data.updateStatus).toBe(UserStoredStatus.Online)
  })

  test("Change user password", async () => {
    const state = await gCall({
      source: ChangeUserPasswordMutation,
      token,
      variableValues: {
        input: {
          currentPassword: "password12345678!",
          newPassword: "password12345678!2"
        }
      }
    })
    expect(state.errors).toBeUndefined()
    expect(state.data.changeUserPassword).toBe(true)

    // try logging in with old password
    const login = await gCall({
      source: LoginMutation,
      variableValues: {
        input: {
          username: user!.username,
          password: "password12345678!"
        }
      }
    })
    expect(login.errors).toBeDefined()
    expect(login.errors).toMatchObject([
      errorConverter(undefined, "INVALID_CREDENTIALS")
    ])

    // try new password
    const login2 = await gCall({
      source: LoginMutation,
      variableValues: {
        input: {
          username: user!.username,
          password: "password12345678!2"
        }
      }
    })
    expect(login2.errors).toBeUndefined()
    expect(login2).toMatchObject({
      data: {
        login: {
          user: {
            id: user!.id,
            username: user!.username,
            email: user!.email
          },
          token: expect.any(String)
        }
      }
    })
  })

  beforeAll(async () => {
    const testUser = new TestUser()
    const register = await gCall({
      source: RegisterMutation,
      variableValues: {
        input: {
          username: testUser.username,
          email: testUser.email,
          password: "password12345678!"
        }
      }
    })
    expect(register.errors).toBeUndefined()
    expect(register).toMatchObject({
      data: {
        register: {
          user: {
            id: expect.any(Number),
            username: testUser.username,
            email: testUser.email
          },
          token: expect.any(String)
        }
      }
    })
    user = register.data?.register?.user
    token = register.data?.register?.token
    user = await getUser(undefined, false)
    token = user!.token
  })
})

beforeAll(async () => {
  await resetState()
})
