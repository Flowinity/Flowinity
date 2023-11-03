import "tsconfig-paths/register"
import "reflect-metadata"
import path from "path"
import { DefaultTpuConfig } from "./classes/DefaultTpuConfig"
import { exec } from "child_process"

export default async function () {
  console.log("init")
  async function setEnvVariables() {
    try {
      global.appRoot = path.resolve(__dirname).includes("out")
        ? path.join(__dirname, "..", "app")
        : path.join(__dirname)
      global.rawAppRoot = path.resolve(__dirname)
      try {
        global.config = require(global.appRoot + "/config/tpu.json")
      } catch {
        global.config = new DefaultTpuConfig().config
      }

      process.env.APP_ROOT = global.appRoot
      process.env.RAW_APP_ROOT = global.rawAppRoot
      process.env.CONFIG = JSON.stringify(global.config)
      process.env.NODE_ENV = "test"
      const db = require("@app/db").default
      await db.query("DROP DATABASE IF EXISTS `upload_test`")
      await db.query("CREATE DATABASE `upload_test`")
      await db.query("USE `upload_test`")
      try {
        // try using system sequelize-cli first, only thing that works in Docker too
        exec("sequelize db:migrate", async (error, stdout, stderr) => {
          console.log(stdout)
          await db.query("SET FOREIGN_KEY_CHECKS = 0")
          await db.models.User.create({
            id: 69,
            username: "testaccountnottakenadmin",
            email: "eee@ee.com",
            password: "nologin",
            administrator: true
          })
          await db.models.Plan.create({
            id: 1,
            internalName: "FREE",
            name: "Free"
          })
          await db.models.Plan.create({
            id: 7,
            internalName: "FREE",
            name: "Free"
          })
          await db.models.Plan.create({
            id: 6,
            internalName: "GOLD",
            name: "Gold"
          })
          await db.models.Domain.create({
            id: 1,
            domain: "localhost",
            userId: 69
          })
          await db.close()
        })
      } catch {
        console.log("errror")
        try {
          exec(global.appRoot + "../node_modules/.bin/sequelize db:migrate")
        } catch {
          console.warn("Could not run sequelize-cli")
        }
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }
  await setEnvVariables()
  await import("./index")
}
