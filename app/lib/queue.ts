import { Queue, Worker } from "bullmq"
import utils from "@app/lib/utils"
import { CacheService } from "@app/services/cache.service"
import { Container } from "typedi"
import { DefaultTpuConfig } from "@app/classes/DefaultTpuConfig"
let config = new DefaultTpuConfig().config
try {
  config = require("@app/config/tpu.json")
} catch {}
const cacheService = Container.get(CacheService)
const connection = {
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.password,
  db: config.redis.db,
  username: config.redis.username
}
const queue = new Queue("queue:uploads", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  }
})

const cacheQueue = new Queue("queue:cache", {
  connection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: true,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  }
})

const worker = new Worker(
  "queue:uploads",
  async (job) => {
    await utils.postUpload(job.data)
  },
  {
    // max number of jobs that can run concurrently
    // another way is removing this option and making multiple workers like worker1, worker2, etx
    concurrency: 3,
    connection
  }
)

const cacheWorker = new Worker(
  "queue:cache",
  async (job) => {
    await cacheService.resetCollectionCache(job.data)
  },
  {
    // max number of jobs that can run concurrently
    // another way is removing this option and making multiple workers like worker1, worker2, etx
    concurrency: 3,
    connection
  }
)

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`)
})

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err}`)
})

cacheWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`)
})

cacheWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err}`)
})

export default {
  queue,
  worker,
  cacheWorker,
  cacheQueue
}
