import { expect, test, afterAll, beforeAll } from "@jest/globals"
import "@app/lib/init-tests"
import { Container } from "typedi"
import { RequestAuth } from "@app/types/express"
import { CoreControllerV4 } from "@app/controllers/v4/core.controller"
const coreController = Container.get(CoreControllerV4)

test("Get Experiments no auth", async () => {
  await coreController.getExperiments(null)
})

test("Get Experiments auth", async () => {
  const user = await authMock(1, "user.view", true)
  await coreController.getExperiments(user)
})

test("Get State", async () => {
  const core = await coreController.getCore(<RequestAuth>{
    ip: "1.1.1.1"
  })
  expect(core).toHaveProperty("name")
})

afterAll(async () => {
  await redis.disconnect()
  await db.close()
})

beforeAll(async () => {
  await db.sync({ force: true })
})
