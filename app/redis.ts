import { createClient } from "redis"

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

client.on("error", (err): void => {
  if (err.hostname !== "defaulthostname") console.warn("[REDIS] Error: " + err)
})

client.connect().then(() => console.log("Redis Client Connected"))

export default client
