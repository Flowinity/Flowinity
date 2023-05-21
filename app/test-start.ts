import path from "path"
import { DefaultTpuConfig } from "./classes/DefaultTpuConfig"

export default async function () {
  function setEnvVariables() {
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
  }
  setEnvVariables()
  await import("./index")
}
