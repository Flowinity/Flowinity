// WARNING: Make sure to always import 'reflect-metadata' and 'module-alias/register' first
import "reflect-metadata"
import "module-alias/register"
import { Container } from "typedi"
import { Server } from "@app/server"
import path from "path"

async function initTPU() {
  global.appRoot = path.resolve(__dirname).includes("out")
    ? path.join(__dirname, "..", "app")
    : path.join(__dirname)
  global.rawAppRoot = path.resolve(__dirname)
  Container.get(Server).init()
}

initTPU().then(() => {})
