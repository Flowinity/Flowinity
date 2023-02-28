import cluster from "cluster"
import os from "os"

if (cluster.isMaster) {
  const cpus = os.cpus().length
  console.log(`Clustering to ${cpus} CPUs`)

  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker, code) => {
    // worker finished because of an error
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log("Worker crashed. Starting a new one")
      cluster.fork()
    }
  })
  const restartWorker = (worker: any, workers: any) => {
    console.log(`Restarting worker ${worker.id}`)
    worker.kill("SIGUSR2")
    const newWorker = cluster.fork()
    newWorker.on("listening", () => {
      console.log(`Worker ${newWorker.id} is now listening`)
    })
  }

  process.on("SIGUSR2", () => {
    const workers = Object.keys(cluster.workers || {})
    console.log("workers: ", workers)
  })

  cluster.on("message", async (worker, message) => {
    console.log("message: ", message)
    if (message === "TPU_RESTART") {
      console.log("Restarting workers")
      const workers = Object.values(cluster.workers || {})

      if (workers.length > 0) {
        for (const worker of workers) {
          restartWorker(worker, workers)
          // wait 4s
          await new Promise((resolve) => setTimeout(resolve, 4000))
        }
      } else {
        console.log("No workers to restart")
      }
    }
  })
} else {
  import("./index")
}
