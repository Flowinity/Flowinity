import { expect, test, afterAll } from "@jest/globals"

process.env.NODE_ENV = "test"
import { CoreService } from "@app/services/core.service"
import { CoreControllerV3 } from "@app/controllers/v3/core.controller"
import { Container } from "typedi"
process.env.CONFIG = JSON.stringify(require("../config/tpu.json"))
import db from "@app/db"
import redis from "@app/redis"
import { authMock } from "@app/lib/auth-mock"
import { RequestAuth } from "@app/types/express"

global.redis = redis
global.db = db
global.config = JSON.parse(process.env.CONFIG)
global.whitelist = []
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
