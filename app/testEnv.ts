import path from "path"
import db from "./db"
import cryptoRandomString from "crypto-random-string"
import { gCall } from "./lib/test-utils/gCall"
import { ClearCacheMutation } from "../frontend-v5/src/graphql/admin/cache.graphql"
import { AdminCacheType } from "../frontend-v5/src/gql/graphql"
import { getUser } from "./lib/test-utils/testUser"

export default async function () {
  global.appRoot = path.resolve(__dirname).includes("out")
    ? path.join(__dirname, "..", "app")
    : path.join(__dirname)
  global.rawAppRoot = path.resolve(__dirname)
  try {
    global.config = require(global.appRoot + "/config/tpu.json")
  } catch {
    throw Error("No config file found")
  }

  process.env.APP_ROOT = global.appRoot
  process.env.RAW_APP_ROOT = global.rawAppRoot
  process.env.CONFIG = JSON.stringify(global.config)
  process.env.NODE_ENV = "test"
  process.env.TEST_RUN_ID = cryptoRandomString({
    length: 10,
    type: "alphanumeric"
  })

  // global.domain = await db.models.Domain.findOne({
  //   where: { id: 1 }
  // }).then((domain: any) => {
  //   if (domain) return domain.domain
  //   else return undefined
  // })
}
