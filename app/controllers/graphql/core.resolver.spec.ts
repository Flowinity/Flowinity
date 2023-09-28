import { afterAll, beforeAll, expect, test } from "@jest/globals"
import "@app/lib/init-tests"
import { Container } from "typedi"
import { CoreResolver } from "@app/controllers/graphql/core.resolver"
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

beforeAll(async () => {})
