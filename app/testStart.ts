import "tsconfig-paths/register"
import "reflect-metadata"
import path from "path"
import { execSync } from "child_process"
import db from "@app/db"
import cryptoRandomString from "crypto-random-string"

export async function init() {
  console.log("init")
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
  await db.query("DROP DATABASE IF EXISTS `upload_test`")
  await db.query("CREATE DATABASE `upload_test`")
  await db.query("USE `upload_test`")
  console.log("DB OK")
  // try using system sequelize-cli first, only thing that works in Docker too
  await execSync("NODE_ENV=test sequelize db:migrate", {
    cwd: global.appRoot,
    stdio: "inherit"
  })
  await new Promise((resolve) => setTimeout(resolve, 500))
  await db.query("SET FOREIGN_KEY_CHECKS = 0")
  await db.models.User.create({
    id: 69,
    username: "testaccountnottakenadmin",
    email: "eee@ee.com",
    password: "nologin",
    administrator: true,
    emailVerified: true
  })
  await db.models.Session.create({
    userId: 69,
    token: "TPU-WEB-" + cryptoRandomString({ length: 128 }),
    scopes: "*",
    type: "session"
  })
  await db.models.Plan.create({
    id: 1,
    internalName: "FREE",
    name: "Free",
    quotaMax: 10000000,
    internalFeatures: { maxFileSize: 69696969, invites: 4 },
    features: [],
    price: 0
  })
  await db.models.Plan.create({
    id: 7,
    internalName: "FREE",
    name: "Free",
    quotaMax: 10000000,
    internalFeatures: { maxFileSize: 69696969, invites: 4 },
    features: [],
    price: 0
  })
  await db.models.Plan.create({
    id: 6,
    internalName: "GOLD",
    name: "Gold",
    quotaMax: 10000000,
    internalFeatures: { maxFileSize: 69696969, invites: 4 },
    icon: "mdi-plus",
    features: [],
    price: 0
  })
  await db.models.Domain.create({
    id: 1,
    domain: "localhost",
    userId: 69
  })
  await db.query("SET FOREIGN_KEY_CHECKS = 1")
  await db.close()
}

init().then(() => process.exit())
