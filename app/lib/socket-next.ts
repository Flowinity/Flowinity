import { createAdapter } from "@socket.io/redis-adapter"

// Import Libs
import { Server } from "socket.io"

export default async function createSocket(
  app: any,
  server: any
): Promise<Server | undefined> {
  if (!config.finishedSetup) return
  const subClient = redis.duplicate()
  const io = new Server(server, {
    path: "/gateway",
    allowEIO3: true,
    transports: ["websocket"]
  })
  await subClient.connect()

  io.adapter(createAdapter(redis, subClient))

  console.info("WS NEXT OK")
  return io
}
