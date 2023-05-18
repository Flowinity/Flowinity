// WARNING: Make sure to always import 'reflect-metadata' and 'module-alias/register' first
import "reflect-metadata"
import "module-alias/register"
import { Container } from "typedi"
import path from "path"

// Import Miscellaneous
import init from "@app/entrypoint"
import { DefaultTpuConfig } from "@app/classes/DefaultTpuConfig"
import fs from "fs"
import { exec } from "child_process"

async function initTPU() {
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
  init()
  checkFrontend()
}

async function checkFrontend() {
  // check rawAppRoot for frontend
  if (await fs.existsSync(path.join(global.rawAppRoot, "../frontend/dist"))) {
    let version = ""
    try {
      version = await fs.readFileSync(
        path.join(global.rawAppRoot, "../frontend/dist/version.txt"),
        "utf-8"
      )
    } catch {
      console.log(
        "version.txt could not be found, it's likely it was built outside of the build script."
      )
      return buildFrontend()
    }
    const pkg = require(path.join(
      global.rawAppRoot,
      "../frontend/package.json"
    ))
    console.log(
      `Compiled frontend version: ${version}, latest frontend version downloaded: ${pkg.version}`
    )
    if (version !== pkg.version) {
      return buildFrontend()
    }
  } else {
    return buildFrontend()
  }
}

async function buildFrontend() {
  console.log("Frontend version is outdated, rebuilding.")
  const pkg = require(path.join(global.rawAppRoot, "../frontend/package.json"))
  // run yarn and yarn build
  // stdout to console
  const upgrade = exec("yarn --frozen-lockfile", {
    cwd: path.join(global.rawAppRoot, "../frontend")
  })
  upgrade.stdout?.on("data", (data) => {
    console.log(data)
  })
  const build = exec("yarn build", {
    cwd: path.join(global.rawAppRoot, "../frontend")
  })
  build.stdout?.on("data", (data) => {
    console.log(data)
  })
  // write version.txt
  await fs.writeFile(
    path.join(global.rawAppRoot, "../frontend/dist/version.txt"),
    pkg.version,
    (err) => {
      if (err) {
        console.error(err)
      }
    }
  )
}

initTPU().then((): void => {})
