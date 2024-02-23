import { Redis } from "ioredis"
import { RedisPubSub } from "graphql-redis-subscriptions"
import { redisHandleError } from "@app/lib/redisHandleError"

let config: any = JSON.parse(process.env.CONFIG || "{}")

let pubSub: RedisPubSub

try {
  if (config.redis?.host !== "defaulthostname") {
    const publishClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db
    })

    const subscribeClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db
    })

    pubSub = new RedisPubSub({
      publisher: publishClient,
      subscriber: subscribeClient
    })

    // catch error
    publishClient.on("error", (error: Error) => {
      redisHandleError(error)
    })

    subscribeClient.on("error", (error: Error) => {
      redisHandleError(error)
    })
  }
} catch (e) {
  redisHandleError(e)
}

export { pubSub }
