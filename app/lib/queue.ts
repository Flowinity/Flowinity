import { Queue, Worker } from "bullmq"
import { Container } from "typedi"

// Import Libs
import utils from "@app/lib/utils"

// Import Services
import { CacheService } from "@app/services/cache.service"

const config = JSON.parse(process.env.CONFIG || "{}")

const cacheService: CacheService = Container.get(CacheService)
const connection: {
  port: number
  host: string
  password?: string
  db?: number
  username?: string
} = {
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.password,
  db: config.redis.db,
  username: config.redis.username
}
const queue: Queue = new Queue("queue:uploads", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  }
})

const cacheQueue: Queue = new Queue("queue:cache", {
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
  async (job): Promise<void> => {
    await utils.postUpload(job.data)
  },
  {
    // Maximum number of jobs that can run concurrently.
    // Another way is removing this option and making multiple workers like worker1, worker2, etc
    concurrency: 3,
    connection
  }
)

const cacheWorker = new Worker(
  "queue:cache",
  async (job): Promise<void> => {
    await cacheService.resetCollectionCache(job.data)
  },
  {
    // Maximum number of jobs that can run concurrently.
    // Another way is removing this option and making multiple workers like worker1, worker2, etc.
    concurrency: 3,
    connection
  }
)

worker.on("completed", (job): void => {
  console.log(`Job ${job.id} completed!`)
})
worker.on("failed", (job, err: Error): void => {
  console.log(`Job ${job?.id} failed with error ${err}`)
})
cacheWorker.on("completed", (job): void => {
  console.log(`Job ${job.id} completed!`)
})
cacheWorker.on("failed", (job, err: Error): void => {
  console.log(`Job ${job?.id} failed with error ${err}`)
})

export default {
  queue,
  worker,
  cacheWorker,
  cacheQueue
}
