import path from "path"
import { DefaultTpuConfig } from "./classes/DefaultTpuConfig"
import { execSync } from "child_process"
import fs from "fs"
import { generateKeyPair } from "crypto"

function isRunningInDocker() {
  try {
    const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8")
    return cgroup.includes("docker")
  } catch (err) {
    return false
  }
}

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

  global.storageRoot = global.config.storage.startsWith("/")
    ? global.config.storage + "/"
    : path.join(global.appRoot, global.config.storage) + "/"

  process.env.APP_ROOT = global.appRoot
  process.env.RAW_APP_ROOT = global.rawAppRoot
  process.env.CONFIG = JSON.stringify(global.config)
  process.env.IS_DOCKER = isRunningInDocker() ? "true" : "false"
  process.env.STORAGE_ROOT = global.storageRoot
  if (global.config.finishedSetup) {
    try {
      // try using system sequelize-cli first, only thing that works in Docker too
      execSync("sequelize db:migrate", {
        env: process.env,
        stdio: "inherit"
      })
    } catch {
      try {
        execSync(global.appRoot + "../node_modules/.bin/sequelize db:migrate", {
          env: process.env,
          stdio: "inherit"
        })
      } catch {
        console.warn("Could not run sequelize-cli")
      }
    }

    // OIDC Private and Public key generation if not already present
    if (!fs.existsSync(global.appRoot + "/config/private.pem")) {
      generateKeyPair(
        "rsa",
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "spki",
            format: "pem"
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
            cipher: "aes-256-cbc",
            passphrase: "top secret"
          }
        },
        (err, publicKey, privateKey) => {
          if (err) {
            console.error(err)
          } else {
            fs.writeFileSync(global.appRoot + "/config/private.pem", privateKey)
            fs.writeFileSync(global.appRoot + "/config/public.pem", publicKey)
          }
        }
      )
    }
  }
}

setEnvVariables()
import("./index")
