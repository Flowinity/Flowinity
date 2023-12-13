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
import {
  EmbedDataV2,
  EmbedMedia,
  EmbedMediaType,
  EmbedType,
  EmbedVersion
} from "@app/classes/graphql/chat/embeds"
import redisClient from "@app/redis"

const trusted = ["youtube.com", "youtu.be", "www.youtube.com", "m.youtube.com"]

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

export async function embedGenerator(
  links: string[],
  attachments: string[]
): Promise<EmbedDataV2[]> {
  let embeds: EmbedDataV2[] = []
  for (const attachment of attachments) {
    const cache = (await redisClient.json.get(
      `embedResolution:attachment:${attachment}`
    )) as EmbedDataV2 | null
    let upload = await Upload.findOne({
      where: {
        attachment: attachment
      }
    })
    if (cache) {
      embeds.push(cache)
      continue
    } else {
      upload = await Upload.findOne({
        where: {
          attachment: attachment
        }
      })
    }

    // TPU Kotlin
    if (!upload) {
      try {
        const url = new URL(attachment)
        if (url.hostname === "media.tenor.com") {
          const test = await ogsMetadataParser(attachment, blacklist)
          if (test) {
            embeds.push(test)
          } else {
            continue
          }
        } else {
          continue
        }
      } catch {
        continue
      }
    }
    if (!upload) continue
    try {
      if (upload.type === "image") {
        const result: ProbeResult = await probe(
          "http://localhost:34582/i/" + upload.attachment
        )

        embeds.push({
          metadata: {
            type: EmbedType.DIRECT,
            restricted: false
          },
          media: [
            {
              attachment: upload.attachment,
              height: result.height,
              width: result.width,
              mimeType: result.mime,
              isInternal: true,
              type: EmbedMediaType.IMAGE
            }
          ],
          text: [],
          version: EmbedVersion.V2
        })
      } else if (upload.type === "video" || upload.type === "audio") {
        embeds.push({
          metadata: {
            type: EmbedType.DIRECT,
            restricted: false
          },
          media: [
            {
              attachment: upload.attachment,
              mimeType: "video/mp4",
              isInternal: true,
              type:
                upload.type === "video"
                  ? EmbedMediaType.VIDEO
                  : EmbedMediaType.AUDIO
            }
          ],
          text: [],
          version: EmbedVersion.V2
        })
      } else {
        embeds.push({
          metadata: {
            type: EmbedType.DIRECT,
            restricted: false
          },
          media: [
            {
              attachment: upload.attachment,
              // todo: fix wrong type
              mimeType: "application/octet-stream",
              isInternal: true,
              type: EmbedMediaType.FILE
            }
          ],
          text: [],
          version: EmbedVersion.V2
        })
      }
    } catch {
      embeds.push({
        metadata: {
          type: EmbedType.DIRECT,
          restricted: false
        },
        text: [],
        media: [
          {
            attachment: upload.attachment,
            mimeType: "application/octet-stream",
            isInternal: true,
            type: EmbedMediaType.FILE
          }
        ],
        version: EmbedVersion.V2
      })
    }
  }

  for (let [, link] of links.entries()) {
    try {
      const url = new URL(link)
      if (
        config.hostname === url.host ||
        config.hostnames?.includes(url.host)
      ) {
        if (url.pathname.startsWith("/invite/")) {
          embeds.push({
            metadata: {
              type: EmbedType.CHAT_INVITE,
              id: url.pathname.split("/invite/")[1],
              restricted: false
            },
            text: [],
            media: [],
            version: EmbedVersion.V2
          })
          continue
        }
      }
      const cache = (await redisClient.json.get(
        `embedResolution:url:${link}`
      )) as EmbedDataV2 | null
      if (cache) {
        embeds.push(cache)
        continue
      }
      const test = await ogsMetadataParser(link, blacklist)
      if (test) {
        embeds.push(test)
        await redisClient.json.set(
          `embedResolution:url:${link}`,
          "$",
          test as any,
          {
            EX: 60 * 60
          }
        )
      }
    } catch {
      const test = await ogsMetadataParser(link, blacklist)
      if (test) embeds.push(test)
    }
  }
  return embeds
}

export default async function embedParser(
  message: Message,
  chatId: number,
  userId: number,
  associationId: number,
  attachments: string[] = []
): Promise<void> {
  // Get all the links in message content, both http and https.
  let links: RegExpMatchArray | [] =
    message.content?.match(/(https?:\/\/[^\s]+)/g) || []
  let embeds: any[] = message.embeds || []
  embeds = embeds.filter((embed) => embed.type === "bot")

  if (links && links.length > 3) links.slice(0, 3)
  if (attachments && attachments.length > 5) attachments.slice(0, 5)

  embeds = await embedGenerator(links, attachments)

  if (embeds.length) {
    await Message.update(
      {
        embeds
      },
      {
        where: {
          id: message.id
        }
      }
    )

    const chatService: ChatService = Container.get(ChatService)

    chatService.emitForAll(
      associationId,
      userId,
      "embedResolution",
      {
        chatId,
        id: message.id,
        embeds,
        userId
      },
      false,
      4
    )

    chatService.emitForAll(
      associationId,
      userId,
      "embedResolution",
      {
        associationId: "__INJECT_ASSOC__",
        message: {
          ...message.toJSON(),
          embeds
        }
      },
      false,
      5
    )
  }
}

async function ogsMetadataParser(
  link: string,
  blacklist: any
): Promise<EmbedDataV2 | null> {
  try {
    const linkURL: URL = new URL(link)

    const restricted = blacklist.includes(linkURL.hostname)

    const { result } = await ogs({
      url: link,
      headers: {
        "user-agent": "TroploPrivateUploader-MediaProxyBot/2.0.0"
      }
    })

    if (result) {
      console.log(result)
      let imagePayload: ImagePayload | null = null

      if (result.ogImage) {
        //@ts-ignore
        const imgResult = await probe(result.ogImage.url)
        imagePayload = generateImagePayload(imgResult)
      }

      let faviconUrl: string | undefined
      if (result.favicon) {
        try {
          const payload = generateImagePayload(await probe(result.favicon))
          faviconUrl = payload.url
        } catch {
          //
        }
      }

      const isTrusted = trusted.includes(linkURL.hostname)

      let videoEmbed: EmbedMedia | null = null
      // TODO: fix wrong type
      //@ts-ignore
      if (isTrusted && result.ogVideo?.url) {
        videoEmbed = {
          //@ts-ignore
          videoEmbedUrl: result.ogVideo.url,
          type: EmbedMediaType.VIDEO,
          isInternal: false,
          //@ts-ignore
          width: result.ogVideo.width,
          //@ts-ignore
          height: result.ogVideo.height
        }
      }
      return {
        metadata: {
          siteName: result.ogSiteName,
          siteIcon: faviconUrl,
          url: result.requestUrl,
          restricted,
          type: EmbedType.REGULAR
        },
        text: [
          ...(result.ogTitle
            ? [
                {
                  text: result.ogTitle,
                  heading: true
                }
              ]
            : []),
          ...(result.ogDescription
            ? [
                {
                  text: result.ogDescription
                }
              ]
            : [])
        ],
        media: [
          ...(imagePayload && !videoEmbed
            ? [
                {
                  url: imagePayload.originalURL,
                  proxyUrl: imagePayload.url,
                  height: imagePayload.height,
                  width: imagePayload.width,
                  mimeType: imagePayload.mimeType,
                  isInternal: false,
                  type: EmbedMediaType.IMAGE
                }
              ]
            : videoEmbed
              ? [videoEmbed]
              : [])
        ],
        version: EmbedVersion.V2
      }
    } else {
      return null
    }
  } catch {
    try {
      const result = await probe(link)
      const imagePayload = generateImagePayload(result)
      const linkURL = new URL(link)

      return {
        metadata: {
          url: imagePayload.originalURL,
          type: EmbedType.REGULAR,
          restricted: blacklist.includes(linkURL.hostname)
        },
        text: [],
        media: [
          {
            url: imagePayload.originalURL,
            proxyUrl: imagePayload.url,
            height: imagePayload.height,
            width: imagePayload.width,
            mimeType: imagePayload.mimeType,
            isInternal: false,
            type: EmbedMediaType.IMAGE
          }
        ],
        version: EmbedVersion.V2
      }
    } catch {
      return null
    }
  }
}

export function embedTranslator(embed: any): EmbedDataV2 | null {
  if (!embed || embed.version === EmbedVersion.V2 || embed.metadata)
    return embed as EmbedDataV2

  // EmbedV1 (2023)
  if (embed.type === "image" && embed.data) {
    return {
      metadata: {
        type: EmbedType.REGULAR,
        restricted: false
      },
      media: [
        {
          url: embed.data.originalURL,
          proxyUrl: embed.data.url,
          height: embed.data.height,
          width: embed.data.width,
          mimeType: embed.data.mimeType,
          isInternal: false,
          type: EmbedMediaType.IMAGE
        }
      ],
      text: [],
      version: EmbedVersion.V2
    }
  }

  if (embed.data?.type === "TPU_DIRECT") {
    return {
      metadata: {
        type: EmbedType.DIRECT,
        restricted: false
      },
      media: [
        {
          attachment: embed.data.upload.attachment,
          height: embed.data.height,
          width: embed.data.width,
          mimeType: embed.data.mimeType,
          isInternal: false,
          type:
            embed.data.upload.type === "image"
              ? EmbedMediaType.IMAGE
              : embed.data.upload.type === "video"
                ? EmbedMediaType.VIDEO
                : embed.data.upload.type === "audio"
                  ? EmbedMediaType.AUDIO
                  : EmbedMediaType.FILE
        }
      ],
      text: [],
      version: EmbedVersion.V2
    }
  }

  if (embed.type === "openGraph" && embed.data) {
    return {
      metadata: {
        type: EmbedType.REGULAR,
        restricted: false,
        url: embed.url,
        siteName: embed.data.siteName
      },
      media: embed.data.image
        ? [
            {
              url: embed.data.image.originalURL,
              proxyUrl: embed.data.image.url,
              height: embed.data.image.height,
              width: embed.data.image.width,
              mimeType: embed.data.image.mimeType,
              isInternal: false,
              type: EmbedMediaType.IMAGE
            }
          ]
        : [],
      text: [
        ...(embed.data.title
          ? [
              {
                text: embed.data.title,
                heading: true
              }
            ]
          : []),
        ...(embed.data.description
          ? [
              {
                text: embed.data.description
              }
            ]
          : [])
      ],
      version: EmbedVersion.V2
    }
  }

  if (embed.type === "native" && embed.data?.type === "TPU_CHAT_INVITE") {
    return {
      metadata: {
        type: EmbedType.CHAT_INVITE,
        restricted: false,
        id: embed.data.id
      },
      media: [],
      text: [],
      version: EmbedVersion.V2
    }
  }

  // Colubrina Legacy Embeds (2022)
  if (embed.securityToken) {
    return {
      metadata: {
        type: EmbedType.REGULAR,
        restricted: false,
        url: embed.url
      },
      media: [
        {
          url: embed.image,
          proxyUrl: `https://colubrina.troplo.com/${embed.mediaProxyLink}`,
          mimeType: "image/png",
          isInternal: false,
          type: EmbedMediaType.IMAGE
        }
      ],
      text: [],
      version: EmbedVersion.V2
    }
  }

  if (embed.openGraph) {
    return {
      metadata: {
        type: EmbedType.REGULAR,
        restricted: false,
        url: embed.link
      },
      media: [],
      text: [
        ...(embed.openGraph.ogTitle
          ? [
              {
                text: embed.openGraph.ogTitle,
                heading: true
              }
            ]
          : []),
        ...(embed.openGraph.ogDescription
          ? [
              {
                text: embed.openGraph.ogDescription
              }
            ]
          : [])
      ],
      version: EmbedVersion.V2
    }
  }

  console.warn("Unable to translate", embed)

  return null
}
