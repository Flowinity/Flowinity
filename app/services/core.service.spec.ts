import { expect, test, afterAll } from "@jest/globals"
import "../lib/init-tests"
import { CoreService } from "@app/services/core.service"
import { Container } from "typedi"
import { CoreControllerV3 } from "@app/controllers/v3/core.controller"
import { RequestAuth } from "@app/types/express"
const coreService = Container.get(CoreService)
const coreController = Container.get(CoreControllerV3)

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
