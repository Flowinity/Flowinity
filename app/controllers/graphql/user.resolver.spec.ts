import { expect, test, afterAll, beforeAll } from "@jest/globals"
import "@app/lib/init-tests"
import { Container } from "typedi"
import { RequestAuth } from "@app/types/express"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Context } from "@app/types/graphql/context"
import { AuthResolver } from "@app/controllers/graphql/auth.resolver"
const userResolver = Container.get(UserResolver)
const authResolver = Container.get(AuthResolver)

let user = {
  id: 1,
  username: "test",
  email: "test@test.com"
}

let token = ""

const fakeContext: Context = {
  // @ts-ignore
  user,
  client: {
    name: "TPUvNEXT",
    version: "4.0.0"
  },
  scopes: "*",
  role: AccessLevel.ADMIN,
  token: "test",
  ip: "1.1.1.1",
  dataloader: null
}

const fakeLoggedOutContext: Context = {
  user: null,
  client: {
    name: "TPUvNEXT",
    version: "4.0.0"
  },
  scopes: "",
  role: AccessLevel.NO_ACCESS,
  token: "",
  ip: "1.1.1.1",
  dataloader: null,
  meta: {},
  req: {
    headers: {
      get: () => "",
      authorization: ""
    }
  } as any
}

test("Register user", async () => {
  const register = await authResolver.register({
    username: "test",
    email: "test@test.com",
    password: "password12345678!"
  })
  expect(register).toBeDefined()
  expect(register?.token).toBeDefined()
  expect(register?.user?.id).toBeDefined()
  user = register?.user
  token = register?.token
})

test("Login user", async () => {
  const login = await authResolver.login(
    {
      username: "test",
      password: "password12345678!",
      totp: ""
    },
    fakeLoggedOutContext
  )
  expect(login).toBeDefined()
  expect(login?.token).toBeDefined()
  expect(login?.user?.id).toBeDefined()
  user = login?.user
  token = login?.token
})

test("Get user and test token", async () => {
  const token = await userResolver.findByToken(fakeContext.token)
  expect(token).toBeDefined()
  expect(token?.user?.username).toBe("test")
  const user = await userResolver.currentUser(fakeContext)
  if (!user) throw new Error("User not found")
  expect(user).toBeDefined()
  const badges = await userResolver.badges(user)
  expect(badges).toBeDefined()
  const notifications = await userResolver.notifications(user, fakeContext)
  expect(notifications).toBeDefined()
  const integrations = await userResolver.integrations(user, fakeContext)
  expect(integrations).toBeDefined()
  const domain = await userResolver.domain(user, fakeContext)
  expect(domain).toBeDefined()
  const plan = await userResolver.plan(user, fakeContext)
  expect(plan).toBeDefined()
  const autoCollectRules = await userResolver.autoCollectRules(
    user,
    fakeContext
  )
  expect(autoCollectRules).toBeDefined()
})

afterAll(async () => {
  await redis.disconnect()
  await db.close()
})

beforeAll(async () => {
  await db.sync({ force: true })
})
