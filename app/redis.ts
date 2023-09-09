import { createClient } from "redis"
import Redis from "ioredis"

const config = JSON.parse(process.env.CONFIG || "{}")

const client = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port
  },
  //@ts-ignore
  username: config.redis.username || undefined,
  //@ts-ignore
  password: config.redis.password || undefined,
  database: config.redis.db
})

const ioRedis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  username: config.redis.username || undefined,
  password: config.redis.password || undefined,
  db: config.redis.db
})

client.on("error", (err): void => {
  if (err.hostname !== "defaulthostname") console.warn("[REDIS] Error: " + err)
})

client.connect().then(() => console.log("Redis Client Connected"))

export default client
export { ioRedis }
