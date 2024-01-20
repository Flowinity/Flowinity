import { beforeAll, expect, test } from "@jest/globals"
import { gCall } from "@app/lib/test-utils/gCall"
import { RegisterMutation } from "../../../frontend/src/graphql/auth/register.graphql"
import { LoginMutation } from "../../../frontend/src/graphql/auth/login.graphql"
import cryptoRandomString from "crypto-random-string"
import "@app/lib/init-tests"
// REQUIRED IMPORT TO COUNT CODE COVERAGE
import { AuthResolver } from "@app/controllers/graphql/auth.resolver"
import { resetState } from "@app/lib/init-tests"

let user = {
  id: 1,
  username: cryptoRandomString({ length: 10, type: "alphanumeric" }),
  email: `${cryptoRandomString({ length: 10, type: "alphanumeric" })}@test.com`
}

let token = ""

describe("AuthResolver", () => {
  test("Register user", async () => {
    const register = await gCall({
      source: RegisterMutation,
      variableValues: {
        input: {
          username: user.username,
          email: user.email,
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
            username: user.username,
            email: user.email
          },
          token: expect.any(String)
        }
      }
    })
    user = register.data?.register?.user
    token = register.data?.register?.token
  })

  test("Login user", async () => {
    const login = await gCall({
      source: LoginMutation,
      variableValues: {
        input: {
          username: user.username,
          password: "password12345678!"
        }
      }
    })
    expect(login.errors).toBeUndefined()
    expect(login).toMatchObject({
      data: {
        login: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          },
          token: expect.any(String)
        }
      }
    })
    token = login.data?.login?.token
  })
})

beforeAll(async () => {
  await resetState()
})
