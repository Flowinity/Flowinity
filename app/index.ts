// WARNING: Make sure to always import 'reflect-metadata' and 'module-alias/register' first
import "reflect-metadata"
import "module-alias/register"
import { Container } from "typedi"
import path from "path"

// Import Miscellaneous
import { Server } from "@app/server"

async function initTPU(): Promise<void> {
  global.appRoot = path.resolve(__dirname).includes("out")
    ? path.join(__dirname, "..", "app")
    : path.join(__dirname)
  global.rawAppRoot = path.resolve(__dirname)

  await Container.get(Server).init()
}

initTPU().then((): void => {
})
