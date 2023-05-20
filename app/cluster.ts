import cluster from "cluster"
import os from "os"
import path from "path"
import { DefaultTpuConfig } from "./classes/DefaultTpuConfig"

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
}

if (cluster.isMaster) {
  setEnvVariables()
  cluster.schedulingPolicy = cluster.SCHED_RR
  // Restrict to 2 processes if the setup is not finished to avoid slow restarts
  const cpus = !global.config?.finishedSetup
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
      console.error("Worker crashed. Starting a new one")

      cluster.fork()
    }
  })
  const restartWorker = (worker: any, workers: any): void => {
    setEnvVariables()
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
      setEnvVariables()
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
