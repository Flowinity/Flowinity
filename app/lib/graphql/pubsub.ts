import { Redis } from "ioredis"
import { RedisPubSub } from "graphql-redis-subscriptions"

let config: any = JSON.parse(process.env.CONFIG || "{}")

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

const pubSub = new RedisPubSub({
  publisher: publishClient,
  subscriber: subscribeClient
})

export { pubSub }
