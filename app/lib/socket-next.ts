import { createAdapter } from "@socket.io/redis-adapter"

// Import Libs
import { Server } from "socket.io"
import { redisHandleError } from "@app/lib/redisHandleError"

export default async function createSocket(
  app: any,
  server: any
): Promise<Server | undefined> {
  if (!config.finishedSetup || config.redis.host === "defaulthostname") return
  const subClient = redis.duplicate()
  const io = new Server(server, {
    path: "/gateway",
    allowEIO3: true,
    transports: ["websocket"]
  })

  try {
    await subClient.connect()
  } catch (e) {
    redisHandleError(e)
  }
  io.adapter(createAdapter(redis, subClient))

  console.info("WS NEXT OK")
  return io
}
