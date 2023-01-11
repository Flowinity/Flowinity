import { Application } from "@app/app"
import * as http from "http"
import { AddressInfo } from "net"
import { Service } from "typedi"
import sequelize from "@app/db"
import { caching } from "cache-manager"

@Service()
export class Server {
  private static readonly appPort: string | number | boolean =
    Server.normalizePort(process.env.PORT || "34582")
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  private static readonly baseDix: number = 10
  private server: http.Server

  // @ts-ignore
  private db: any

  constructor(private readonly application: Application) {}

  private static normalizePort(
    val: number | string
  ): number | string | boolean {
    const port: number =
      typeof val === "string" ? parseInt(val, this.baseDix) : val
    if (isNaN(port)) {
      return val
    } else if (port >= 0) {
      return port
    } else {
      return false
    }
  }
  async init(): Promise<void> {
    this.application.app.set("port", Server.appPort)
    this.application.app.set("trust proxy", 1)
    const memoryCache = await caching("memory")
    this.application.app.set("cache", memoryCache)
    this.db = sequelize
    this.server = http.createServer(this.application.app)

    this.server.listen(Server.appPort)
    this.server.on("error", (error: NodeJS.ErrnoException) =>
      this.onError(error)
    )
    this.server.on("listening", () => this.onListening())
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
      throw error
    }
    const bind: string =
      typeof Server.appPort === "string"
        ? "Pipe " + Server.appPort
        : "Port " + Server.appPort
    switch (error.code) {
      case "EACCES":
        // eslint-disable-next-line no-console
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case "EADDRINUSE":
        // eslint-disable-next-line no-console
        console.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  }

  /**
   * Se produit lorsque le serveur se met à écouter sur le port.
   */
  private onListening(): void {
    const addr = this.server.address() as AddressInfo
    const bind: string = `port ${addr.port}`
    // eslint-disable-next-line no-console
    console.log(`Listening on ${bind}`)
  }
}
