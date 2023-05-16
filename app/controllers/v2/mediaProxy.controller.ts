import { Request, Response } from "express"
import { Service } from "typedi"
import Router from "express-promise-router"
import { MediaProxyService } from "@app/services/mediaProxy.service"
import { ImagePayload } from "@app/lib/embedParser"

@Service()
export class MediaProxyController {
  router: any

  constructor(private readonly mediaProxyService: MediaProxyService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.get("/embed/:token", async (req: Request, res: Response) => {
      const { token } = req.params
      const data = await this.mediaProxyService.proxyEmbedJWT(token)
      const { mimeType } = data.data as ImagePayload
      res.set("Content-Type", mimeType || "image/png")
      res.set("Cache-Control", "public, max-age=31536000")
      res.send(data.file)
    })
  }
}
