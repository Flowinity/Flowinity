import { Controller, Get, Param, Res } from "routing-controllers"
import { Service } from "typedi"
import { MediaProxyService } from "@app/services/mediaProxy.service"
import { ImagePayload } from "@app/lib/embedParser"
import { Response } from "express"

@Service()
@Controller("/mediaproxy")
export class MediaProxyControllerV4 {
  constructor(private readonly mediaProxyService: MediaProxyService) {}

  @Get("/embed/:token")
  async getEmbed(@Param("token") token: string, @Res() res: Response) {
    const data = await this.mediaProxyService.proxyEmbedJWT(token)
    const { mimeType } = data.data as ImagePayload
    res.set("Content-Type", mimeType || "image/png")
    res.set("Cache-Control", "public, max-age=31536000")
    res.send(data.file)
    return res
  }
}
