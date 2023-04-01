import { createClient } from "redis"
import config from "./config/tpu.json"

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

client.on("error", (err) => console.log("Redis Client Error", err))

client.connect().then(() => console.log("Redis Client Connected"))
export default client
