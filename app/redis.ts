import { createClient } from "redis"

// Import Classes
import { DefaultTpuConfig } from "@app/classes/DefaultTpuConfig"

let config: TpuConfig = new DefaultTpuConfig().config

try {
  config = require("@app/config/tpu.json")
} catch {}

if (!config) {
  console.warn(
    "[REDIS] Cannot initialize Redis as the TPU config could not be found!"
  )

  throw new Error("TPU config not found.")
}

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
