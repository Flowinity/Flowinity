import dayjs from "dayjs"
import db from "@app/db"
import redis from "@app/redis"
import { authMock } from "@app/lib/auth-mock"
import isoWeek from "dayjs/plugin/isoWeek"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import io from "../lib/socket-mock"
import { getUser } from "@app/lib/test-utils/testUser"
import { gCall } from "@app/lib/test-utils/gCall"

process.env.NODE_ENV = "test"
process.env.CONFIG = JSON.stringify(require("../config/tpu.json"))
global.redis = redis
global.db = db
global.config = JSON.parse(process.env.CONFIG)
global.whitelist = []
global.authMock = authMock
dayjs.extend(isoWeek)
dayjs().isoWeek()
dayjs().isoWeekday()
dayjs().isoWeekYear()
dayjs.extend(isSameOrBefore)
global.dayjs = dayjs
io.init()

export async function resetState() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const user = await getUser(undefined, undefined, true)

  const data = await gCall({
    source: `
      mutation AdminClearCache($input: ClearCacheInput!) {
        adminClearCache(input: $input) {
          success
        }
      }
    `,
    variableValues: {
      input: {
        type: "state",
        await: true,
        userId: null
      }
    },
    token: user.token
  })

  if (!data?.data?.adminClearCache?.success)
    throw Error("Failed to clear cache" + JSON.stringify(data))
}
