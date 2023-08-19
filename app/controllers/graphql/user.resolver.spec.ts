import { expect, test, afterAll, beforeAll } from "@jest/globals"
import "@app/lib/init-tests"
import { Container } from "typedi"
import { RequestAuth } from "@app/types/express"
import { CoreControllerV4 } from "@app/controllers/v4/core.controller"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
const userResolver = Container.get(UserResolver)

afterAll(async () => {
  await redis.disconnect()
  await db.close()
})

beforeAll(async () => {
  await db.sync({ force: true })
})
