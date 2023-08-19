import { expect, test, afterAll, beforeAll } from "@jest/globals"
import "@app/lib/init-tests"
import { Container } from "typedi"
import { RequestAuth } from "@app/types/express"
import { CoreControllerV4 } from "@app/controllers/v4/core.controller"
import { CoreResolver } from "@app/controllers/graphql/core.resolver"
import { Ctx } from "type-graphql"
import { Context } from "@app/types/graphql/context"
const coreResolver = Container.get(CoreResolver)

test("Get core state", async () => {
  const state = await coreResolver.coreState({} as Context)
  expect(state).toBeDefined()
  expect(state?.name).toBe("TPU")
})

afterAll(async () => {
  await redis.disconnect()
  await db.close()
})

beforeAll(async () => {
  await db.sync({ force: true })
})
