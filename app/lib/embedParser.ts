import ogs from "@troplo/tpu-ogs"
import { Message } from "@app/models/message.model"
import { ChatService } from "@app/services/chat.service"
import { Container } from "typedi"
import probe from "probe-image-size"
import jwt from "jsonwebtoken"

export interface ImagePayload {
  originalURL: string
  width: number
  height: number
  mimeType: string
  url: string
}

function generateImagePayload(imageResult: probe.ProbeResult) {
  let imagePayload = {
    originalURL: imageResult.url,
    width: imageResult.width,
    height: imageResult.height,
    mimeType: imageResult.mime,
    url: ""
  }
  const jwtImage = jwt.sign(imagePayload, "deez")
  imagePayload.url = `/api/v2/mediaproxy/embed/${jwtImage}`
  return imagePayload
}

export default async function (
  message: Message,
  chatId: number,
  userId: number,
  associationId: number
) {
  // get all links in message content, both http and https
  let links = message.content?.match(/(https?:\/\/[^\s]+)/g) || []
  let embeds = []
  if (links && links.length > 3) {
    links.slice(0, 3)
  }
  for (let [i, link] of links.entries()) {
    try {
      console.log(i, link)
      const { result } = await ogs({
        url: link,
        headers: {
          "user-agent": "TroploPrivateUploader-MediaProxyBot/2.0.0"
        }
      })
      if (result) {
        let imagePayload: ImagePayload | null = null
        if (result.ogImage) {
          //@ts-ignore
          const imgResult = await probe(result.ogImage.url)
          imagePayload = generateImagePayload(imgResult)
        }
        embeds.push({
          data: {
            title: result.ogTitle,
            description: result.ogDescription,
            url: result.requestUrl,
            image: imagePayload,
            siteName: result.ogSiteName,
            type: result.ogType
          },
          type: "openGraph",
          url: link
        })
      }
    } catch {
      try {
        const result = await probe(link)
        const imagePayload = generateImagePayload(result)
        embeds.push({
          data: imagePayload,
          type: "image",
          url: imagePayload.originalURL
        })
      } catch {}
    }
    if (embeds.length) {
      await message.update({
        embeds
      })
      const chatService = Container.get(ChatService)
      await chatService.emitForAll(associationId, userId, "embedResolution", {
        chatId,
        id: message.id,
        embeds,
        userId
      })
    }
  }
}
