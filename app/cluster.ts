import cluster from "cluster"
import os from "os"
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

if (cluster.isPrimary) {
  setEnvVariables()
  cluster.schedulingPolicy = cluster.SCHED_RR
  // Restrict to 2 processes if the setup is not finished to avoid slow restarts
  const cpus =
    !global.config?.finishedSetup && os.cpus().length >= 2
      ? 2
      : parseInt(process.env.THREADS || "0") ||
        global.config?.threads ||
        os.cpus().length

  console.info(`Clustering to ${cpus} CPUs`)

  for (let i: number = 0; i < cpus; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker, code: number): void => {
    // Worker finished because of an error
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.error(`Worker crashed. Starting a new one, code: ${code}`)

      cluster.fork()
    }
  })
  const restartWorker = async (worker: any, workers: any) => {
    await setEnvVariables()
    console.info(`Restarting worker ${worker.id}`)

    worker.kill("SIGUSR2")

    const newWorker = cluster.fork()

    newWorker.on("listening", (): void => {
      console.info(`Worker ${newWorker.id} is now listening`)
    })
  }

  process.on("SIGUSR2", (): void => {
    const workers: string[] = Object.keys(cluster.workers || {})

    console.info("workers: ", workers)
  })

  cluster.on("message", async (worker, message): Promise<void> => {
    console.info("message: ", message)

    if (message === "TPU_RESTART") {
      await setEnvVariables()
      console.info("Restarting workers")
      const workers = Object.values(cluster.workers || {})

      if (workers.length > 0) {
        for (const worker of workers) {
          restartWorker(worker, workers)

          // Wait 4 seconds
          await new Promise((resolve) => setTimeout(resolve, 4000))
        }
      } else {
        console.info("No workers to restart")
      }
    }
  })
} else {
  import("./index")
}
