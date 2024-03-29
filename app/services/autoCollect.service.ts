import { Service } from "typedi"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Collection } from "@app/models/collection.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import Errors from "@app/lib/errors"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { Upload } from "@app/models/upload.model"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { ActOnAutoCollectAction } from "@app/classes/graphql/autoCollects/actOnAutoCollectsInput"
import { pubSub } from "@app/lib/graphql/pubsub"
import { AutoCollectApprovalType } from "@app/classes/graphql/autoCollects/subscriptions/autoCollectApprovalEvent"

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
    action: ActOnAutoCollectAction
  ) {
    switch (action) {
      case ActOnAutoCollectAction.APPROVE:
        await CollectionItem.create({
          attachmentId: autoCollect.uploadId,
          collectionId: autoCollect.collectionId,
          userId,
          identifier: autoCollect.uploadId + "-" + autoCollect.collectionId
        })
        pubSub.publish(`AUTO_COLLECT_APPROVAL:${userId}`, {
          type: AutoCollectApprovalType.APPROVED,
          autoCollectApproval: autoCollect.toJSON()
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
      case ActOnAutoCollectAction.REJECT:
        pubSub.publish(`AUTO_COLLECT_APPROVAL:${userId}`, {
          type: AutoCollectApprovalType.DENIED,
          autoCollectApproval: autoCollect.toJSON()
        })
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
