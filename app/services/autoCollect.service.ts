import { Service } from "typedi"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Collection } from "@app/models/collection.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import Errors from "@app/lib/errors"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { Upload } from "@app/models/upload.model"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"

@Service()
export class AutoCollectService {
  async getAutoCollects(userId: number): Promise<object[]> {
    const autoCollects = await redis.json.get(`autoCollects:${userId}`)
    if (autoCollects) {
      return autoCollects
    } else {
      return await AutoCollectApproval.findAll({
        where: {
          userId
        },
        include: [
          {
            model: Collection,
            as: "collection"
          },
          {
            model: Upload,
            as: "attachment",
            required: true
          }
        ]
      })
    }
  }

  async actAutoCollect(
    userId: number,
    autoCollect: AutoCollectApproval,
    action: "approve" | "deny"
  ) {
    switch (action) {
      case "approve":
        await CollectionItem.create({
          attachmentId: autoCollect.uploadId,
          collectionId: autoCollect.collectionId,
          userId,
          identifier: autoCollect.uploadId + "-" + autoCollect.collectionId
        })
        socket
          .of(SocketNamespaces.AUTO_COLLECTS)
          .to(userId)
          .emit("autoCollectApproval", {
            type: "approve",
            id: autoCollect.id
          })
        await autoCollect.destroy()
        return true
      case "deny":
        socket
          .of(SocketNamespaces.AUTO_COLLECTS)
          .to(userId)
          .emit("autoCollectApproval", {
            type: "deny",
            id: autoCollect.id
          })
        await autoCollect.destroy()
        return true
      default:
        throw Errors.INVALID_PARAMETERS
    }
  }

  async getUserAutoCollectRules(userId: number): Promise<object[]> {
    return await AutoCollectRule.findAll({
      where: {
        userId
      }
    })
  }
}
