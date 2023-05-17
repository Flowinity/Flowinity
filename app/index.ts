// WARNING: Make sure to always import 'reflect-metadata' and 'module-alias/register' first
import "reflect-metadata"
import "module-alias/register"
import { Container } from "typedi"
import path from "path"

// Import Miscellaneous
import init from "@app/entrypoint"
import { DefaultTpuConfig } from "@app/classes/DefaultTpuConfig"

async function initTPU(): Promise<void> {
  global.appRoot = path.resolve(__dirname).includes("out")
    ? path.join(__dirname, "..", "app")
    : path.join(__dirname)
  global.rawAppRoot = path.resolve(__dirname)
  try {
    global.config = require(global.appRoot + "/config/tpu.json")
  } catch {
    global.config = new DefaultTpuConfig().config
  }
  console.log("Entrypoint initialized")
  await new Promise((resolve) => setTimeout(resolve, 100))
  init()
}

initTPU().then((): void => {})
