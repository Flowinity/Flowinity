import { Queue, Worker } from "bullmq"
import utils from "@app/lib/utils"

const config = require("@app/config/tpu.json")

const queue = new Queue("queue:uploads", {
  connection: {
    port: config.redis.port,
    host: config.redis.host,
    password: config.redis.password,
    db: config.redis.db,
    username: config.redis.username
  },
  defaultJobOptions: {
    attempts: 3,
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
    connection: {
      port: config.redis.port,
      host: config.redis.host,
      password: config.redis.password,
      db: config.redis.db,
      username: config.redis.username
    }
  }
)

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`)
})

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err}`)
})

export default {
  queue,
  worker
}
