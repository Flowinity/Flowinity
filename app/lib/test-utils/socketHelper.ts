import { Manager, Socket } from "socket.io-client"
import { Container } from "typedi"
import { Server } from "@app/server"

export async function connectSocket(
  namespace: string,
  token: string
): Promise<{
  socketClient: Socket
  port: number
}> {
  const server = Container.get(Server)
  let port = 0

  function genPort() {
    port = Math.floor(Math.random() * (65535 - 1024 + 1) + 1024)
    if (port === 34582 || port === 3000 || port > 65535 || port === 0)
      return genPort()
  }
  genPort()
  await server.init(port, true)
  server.server.listen(port)
  await new Promise((resolve) => setTimeout(resolve, 50))

  const manager = new Manager(`ws://127.0.0.1:${port}`, {
    transports: ["websocket"],
    reconnection: true,
    path: `/gateway`
  })

  const socketClient = manager.socket(namespace, {
    auth: {
      token
    }
  })
  socketClient.on("connect", () => {
    Promise.resolve()
    console.log("connected")
  })
  socketClient.on("connect_error", (err) => {
    console.log("socket error", err)
  })
  console.log(socketClient?.connect(), "connect try", socketClient)
  socketClient?.connect()
  await new Promise((resolve) => setTimeout(resolve, 50))

  return { socketClient, port }
}

export function waitForSocketEvent(
  socketClient: Socket | null,
  eventName: string,
  timeout: number,
  cb = (data: any) => {}
) {
  return new Promise((resolve, reject) => {
    // Create a promise that resolves when the socket event is received
    if (!socketClient?.connected) throw new Error("Socket not connected")
    const socketEventPromise = new Promise((innerResolve) => {
      socketClient!.on(eventName, (data: any) => {
        innerResolve(data)
        cb(data)
        socketClient!.off(eventName)
      })
    })

    // Create a promise that rejects after the specified timeout
    const timeoutPromise = new Promise((_, innerReject) => {
      setTimeout(() => {
        innerReject(
          new Error(`Timeout waiting for socket event '${eventName}'`)
        )
      }, timeout)
    })

    // Use Promise.race to wait for either the socket event or timeout
    Promise.race([socketEventPromise, timeoutPromise])
      .then(resolve)
      .catch(reject)
  })
}
