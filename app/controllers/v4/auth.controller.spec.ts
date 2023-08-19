import { expect, test, afterAll, beforeAll } from "@jest/globals"
import "@app/lib/init-tests"
import { Container } from "typedi"
import { RequestAuth } from "@app/types/express"
import { CoreControllerV4 } from "@app/controllers/v4/core.controller"
import { AuthControllerV4 } from "@app/controllers/v4/auth.controller"
const coreController = Container.get(CoreControllerV4)

const user1 = {
  email: "test@troplo.com",
  username: "test",
  password: "thisisover8characterslong"
}

const user2 = {
  email: "test2@troplo.com",
  username: "test2",
  password: "thisisover8characterslong"
}

const authController = Container.get(AuthControllerV4)

test("Create account", async () => {
  const data = await authController.register({
    email: user1.email,
    username: user1.username,
    password: user1.password
  })
  expect(data).toHaveProperty("token")
})

test("Login to account", async () => {
  const data = await authController.login({
    email: user1.email,
    password: user1.password
  })
  expect(data).toHaveProperty("token")
})

test("Send recovery email", async () => {
  const recovery = await authController.recover({
    email: user1.email
  })
  expect(recovery).toBeUndefined()
})

afterAll(async () => {
  await redis.disconnect()
  await db.close()
})

beforeAll(async () => {
  await db.sync({ force: true })
})
