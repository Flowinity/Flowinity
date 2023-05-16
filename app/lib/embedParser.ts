import { Container } from "typedi"
import probe, { ProbeResult } from "probe-image-size"
import jwt from "jsonwebtoken"

// Import Miscellaneous
import ogs from "@troplo/tpu-ogs"
import blacklist from "./blacklist.json"

// Import Models
import { Upload } from "@app/models/upload.model"

// Import Models
import { Message } from "@app/models/message.model"

// Import Services
import { ChatService } from "@app/services/chat.service"

export interface ImagePayload {
  originalURL: string
  width: number
  height: number
  mimeType: string
  url: string
}

function generateImagePayload(imageResult: probe.ProbeResult): {
  originalURL: string
  width: number
  height: number
  mimeType: string
  url: string
} {
  let imagePayload: {
    originalURL: string
    width: number
    height: number
    mimeType: string
    url: string
  } = {
    originalURL: imageResult.url,
    width: imageResult.width,
    height: imageResult.height,
    mimeType: imageResult.mime,
    url: ""
  }
  const jwtImage: string = jwt.sign(imagePayload, config.mediaProxySecret)
  imagePayload.url = `/api/v3/mediaproxy/embed/${jwtImage}`

  return imagePayload
}

export default async function (
  message: Message,
  chatId: number,
  userId: number,
  associationId: number,
  attachments: string[] = []
): Promise<void> {
  // Get all the links in message content, both http and https.
  let links: RegExpMatchArray | [] =
    message.content?.match(/(https?:\/\/[^\s]+)/g) || []
  let embeds: any[] = []

  if (links && links.length > 3) links.slice(0, 3)
  if (attachments && attachments.length > 5) attachments.slice(0, 5)

  for (const attachment of attachments) {
    const upload: Upload | null = await Upload.findOne({
      where: {
        attachment: attachment
      }
    })

    if (!upload) continue

    try {
      if (upload.type === "image") {
        const result: ProbeResult = await probe(
          "http://localhost:34582/i/" + upload.attachment
        )

        embeds.push({
          data: {
            url: "https://i.troplo.com/i/" + upload.attachment,
            originalURL: "https://i.troplo.com/i/" + upload.attachment,
            width: result.width,
            height: result.height,
            mimeType: result.mime,
            type: "TPU_DIRECT",
            upload
          },
          type: "image",
          url: "https://i.troplo.com/i/" + upload.attachment
        })
      } else if (upload.type === "video" || upload.type === "audio") {
        embeds.push({
          data: {
            url: "https://i.troplo.com/i/" + upload.attachment,
            originalURL: "https://i.troplo.com/i/" + upload.attachment,
            type: "TPU_DIRECT",
            upload
          },
          type: upload.type,
          url: "https://i.troplo.com/i/" + upload.attachment
        })
      } else {
        embeds.push({
          data: {
            url: "https://i.troplo.com/i/" + upload.attachment,
            originalURL: "https://i.troplo.com/i/" + upload.attachment,
            type: "TPU_DIRECT",
            upload
          },
          type: "file",
          url: "https://i.troplo.com/i/" + upload.attachment
        })
      }
    } catch {
      embeds.push({
        data: {
          url: "https://i.troplo.com/i/" + upload.attachment,
          originalURL: "https://i.troplo.com/i/" + upload.attachment,
          type: "TPU_DIRECT",
          upload
        },
        type: "file",
        url: "https://i.troplo.com/i/" + upload.attachment
      })
    }
  }

  for (let [, link] of links.entries()) {
    try {
      const linkURL: URL = new URL(link)

      if (blacklist.includes(linkURL.hostname)) {
        embeds.push({
          link: link,
          type: "openGraph",
          data: {
            title: "Blacklisted link",
            description: "This link cannot be mediaproxied at this time."
          }
        })

        continue
      }

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
  }

  if (embeds.length) {
    await message.update({
      embeds
    })

    const chatService: ChatService = Container.get(ChatService)

    await chatService.emitForAll(associationId, userId, "embedResolution", {
      chatId,
      id: message.id,
      embeds,
      userId
    })
  }
}
