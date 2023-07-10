// WARNING: Make sure to always import 'reflect-metadata' and 'module-alias/register' first
import "reflect-metadata"
import "module-alias/register"
import { Container } from "typedi"
import path from "path"

// Import Miscellaneous
import { DefaultTpuConfig } from "@app/classes/DefaultTpuConfig"
import fs from "fs"
import { execSync } from "child_process"
import cluster from "cluster"
import os from "os"
import { Server } from "@app/server"

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

  global.storageRoot = <string>process.env.STORAGE_ROOT

  console.info("[PRIVATEUPLOADER] Entrypoint initialised.")

  await Container.get(Server).init()

  const cpuCount: number = os.cpus().length
  const mainWorker: boolean =
    !cluster.worker || cluster.worker?.id % cpuCount === 1

  if (mainWorker && config.release !== "dev" && !config.officialInstance)
    await checkFrontend()
}

async function checkFrontend() {
  if (fs.existsSync(path.join(global.rawAppRoot, "../frontend_build"))) {
    let version: string = ""

    try {
      version = fs.readFileSync(
        path.join(global.rawAppRoot, "../frontend_build/version.txt"),
        "utf-8"
      )
    } catch {
      console.info(
        "[PRIVATEUPLOADER/FRONTEND] version.txt could not be found, it's likely it was built outside of the build script."
      )

      return buildFrontend()
    }

    const pkg = require(path.join(
      global.rawAppRoot,
      "../frontend/package.json"
    ))

    console.info(
      `[PRIVATEUPLOADER/FRONTEND] Compiled frontend version: ${version}, latest frontend revision from local disk: ${pkg.version}`
    )

    if (version !== pkg.version) return buildFrontend()
  } else return buildFrontend()
}

async function buildFrontend() {
  console.info("[PRIVATEUPLOADER/FRONTEND] Version is outdated, rebuilding...")

  const pkg = require(path.join(global.rawAppRoot, "../frontend/package.json"))

  try {
    await execSync("yarn --frozen-lockfile", {
      cwd: path.join(global.rawAppRoot, "../frontend"),
      stdio: "inherit"
    })
    await execSync(config.officialInstance ? "yarn build-prod" : "yarn build", {
      cwd: path.join(global.rawAppRoot, "../frontend"),
      stdio: "inherit"
    })

    await fs.writeFileSync(
      path.join(global.rawAppRoot, "../frontend/dist/version.txt"),
      pkg.version
    )

    if (!fs.existsSync(path.join(global.rawAppRoot, "../frontend_build")))
      await fs.mkdirSync(path.join(global.rawAppRoot, "../frontend_build"))

    await execSync("cp -r ../frontend/dist/* ../frontend_build", {
      cwd: global.rawAppRoot,
      stdio: "inherit"
    })
  } catch (err) {
    console.error(
      `[PRIVATEUPLOADER/FRONTEND] Failed to build with error: ${err}.`
    )
  }
}

initTPU().then((): void => {
  //
})
