import { Service } from "typedi"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionUser } from "@app/models/collectionUser.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"
import { generateCollectionCache } from "@app/lib/cache"
import Errors from "@app/lib/errors"
import { CollectionCache } from "@app/types/collection"

@Service()
export class CollectionService {
  async getCollections(userId: number) {
    const collections = await Collection.findAll({
      where: {
        userId
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        },
        {
          model: CollectionUser,
          as: "users",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"]
            }
          ]
        },
        {
          model: CollectionItem,
          as: "preview",
          include: [
            {
              model: Upload,
              as: "attachment",
              attributes: ["id", "attachment"],
              where: {
                type: "image"
              }
            }
          ]
        }
      ]
    })
    let collectionShared = await Collection.findAll({
      include: [
        {
          model: CollectionUser,
          as: "users",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"]
            }
          ]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        },
        {
          model: CollectionUser,
          as: "recipient",
          required: true,
          where: {
            recipientId: userId
          }
        },
        {
          model: CollectionItem,
          as: "preview",
          include: [
            {
              model: Upload,
              as: "attachment",
              attributes: ["id", "attachment"],
              where: {
                type: "image"
              }
            }
          ]
        }
      ]
    })
    for (let i = 0; i < collections.length; i++) {
      collections[i].dataValues.items = await CollectionItem.count({
        where: {
          collectionId: collections[i].id
        }
      })
    }
    for (let i = 0; i < collectionShared.length; i++) {
      collectionShared[i].dataValues.items = await CollectionItem.count({
        where: {
          collectionId: collectionShared[i].id
        }
      })
    }
    return [
      ...collections.map((collection) => ({
        ...collection.dataValues,
        permissionsMetadata: {
          write: true,
          configure: true,
          read: true
        }
      })),
      ...collectionShared.map((collection) => {
        return {
          ...collection.dataValues,
          shared: true,
          permissionsMetadata: {
            write: collection.dataValues.recipient.dataValues.write,
            configure: collection.dataValues.recipient.dataValues.configure,
            read: collection.dataValues.recipient.dataValues.read
          }
        }
      })
    ]
  }

  async getCachedCollections(userId: number) {
    if (await redis.json.get(`collections:${userId}`)) {
      return await redis.json.get(`collections:${userId}`)
    } else {
      generateCollectionCache()
      return await this.getCollections(userId)
    }
  }

  async getCollectionPermissions(
    collectionId: number,
    userId: number,
    permission: "write" | "configure" | "read"
  ) {
    const collections = await redis.json.get(`collections:${userId}`)

    const collection = collections.find(
      (collection: CollectionCache) => collection.id === collectionId
    )

    if (!collection) {
      return false
    }

    return collection.permissionsMetadata[permission]
  }

  async addToCollection(
    collectionId: number,
    uploadId: number | Array<number>,
    userId: number
  ) {
    if (typeof uploadId === "object" && uploadId?.length > 20) {
      throw Errors.PLACEHOLDER
    }
    if (typeof uploadId === "number") {
      return await CollectionItem.create({
        collectionId,
        attachmentId: uploadId,
        userId,
        identifier: uploadId + "-" + collectionId
      })
    } else {
      let items = []
      for (const upload of uploadId) {
        items.push(
          await CollectionItem.create({
            collectionId,
            attachmentId: upload,
            userId,
            identifier: upload + "-" + collectionId
          })
        )
      }
      return items
    }
  }
}
