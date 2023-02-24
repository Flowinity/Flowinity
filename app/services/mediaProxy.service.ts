import { Service } from "typedi"
import axios from "axios"
import jwt from "jsonwebtoken"
import { ImagePayload } from "@app/lib/embedParser"
import Errors from "@app/lib/errors"

@Service()
export class MediaProxyService {
  async proxyEmbedJWT(token: string) {
    try {
      const parsed = jwt.verify(token, config.mediaProxySecret)
      if (parsed) {
        const { originalURL } = parsed as ImagePayload
        const { data } = await axios.get(originalURL, {
          responseType: "arraybuffer",
          headers: {
            "user-agent": "TroploPrivateUploader-MediaProxyBot/2.0.0"
          }
        })
        return {
          file: data,
          data: parsed
        }
      } else {
        throw Errors.MEDIAPROXY_INVALID_TOKEN
      }
    } catch {
      throw Errors.MEDIAPROXY_INVALID_TOKEN
    }
  }
}
