import { Service } from "typedi"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { CollectionUser } from "@app/models/collectionUser.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Upload } from "@app/models/upload.model"
import Errors from "@app/lib/errors"
import { CollectionCache } from "@app/types/collection"
import cryptoRandomString from "crypto-random-string"
import { Friend } from "@app/models/friend.model"

@Service()
export class CollectionService {
  async createCollection(userId: number, name: string) {
    return await Collection.create({
      userId,
      name
    })
  }

  // this is not used by any routes!!
  async getCollection(id: number) {
    const collection = await Collection.findOne({
      where: {
        id
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

    if (!collection) throw Errors.COLLECTION_NOT_FOUND

    collection.dataValues.items = await CollectionItem.count({
      where: {
        collectionId: collection.id
      }
    })

    return collection
  }

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

  async getCollectionsFilter(userId: number, type: string, search: string) {
    let collections: CollectionCache[] =
      (await redis.json.get(`collections:${userId}`)) ||
      this.getCollections(userId)
    if (type === "owned") {
      collections = collections.filter(
        (collection) => collection.userId === userId
      )
    } else if (type === "shared") {
      collections = collections.filter((collection) => collection.shared)
    } else if (type === "write") {
      collections = collections.filter(
        (collection) => collection.permissionsMetadata.write
      )
    } else if (type === "configure") {
      collections = collections.filter(
        (collection) => collection.permissionsMetadata.configure
      )
    }

    if (search) {
      collections = collections.filter((collection) =>
        collection.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return collections
  }

  async getCollectionPermissions(
    collectionId: number | string,
    userId: number | null,
    permission: "write" | "configure" | "read" | "owner"
  ) {
    if (!userId) {
      const collection = await redis.json.get(`shareLinks:${collectionId}`)
      if (!collection) return false
      return permission === "read"
    }
    const collections = await redis.json.get(`collections:${userId}`)

    const collection = collections.find(
      (collection: CollectionCache) => collection.id === collectionId
    )

    if (!collection) return false
    if (permission === "owner") return collection.userId === userId
    return collection.permissionsMetadata[permission]
  }

  async getCollectionOrShare(
    collectionId: number | string,
    userId: number | null
  ) {
    if (!userId) {
      const collection = await redis.json.get(`shareLinks:${collectionId}`)
      if (!collection) return false
      return collection
    }
    const collections = await redis.json.get(`collections:${userId}`)
    const collection = collections.find(
      (collection: CollectionCache) => collection.id === collectionId
    )
    if (!collection) return false
    return collection
  }

  async addToCollection(
    collectionId: number,
    uploadId: number | Array<number>,
    userId: number
  ) {
    if (typeof uploadId === "object" && uploadId?.length > 24) {
      throw Errors.INVALID_PARAMETERS
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
        try {
          items.push(
            await CollectionItem.create({
              collectionId,
              attachmentId: upload,
              userId,
              identifier: upload + "-" + collectionId
            })
          )
        } catch {}
      }
      return items
    }
  }

  async removeFromCollection(
    collectionId: number,
    uploadId: number | Array<number>
  ) {
    const result = await CollectionItem.destroy({
      where: {
        collectionId,
        attachmentId: uploadId
      }
    })

    if (!result) throw Errors.COLLECTION_ITEM_NOT_FOUND

    return result
  }

  async removeUserFromCollection(collectionId: number, recipientId: number) {
    const result = await CollectionUser.destroy({
      where: {
        collectionId,
        recipientId
      }
    })

    if (!result) throw Errors.COLLECTION_USER_NOT_FOUND

    return result
  }

  async addUserToCollection(
    collectionId: number,
    senderId: number,
    username: string,
    write: boolean,
    configure: boolean,
    read: boolean
  ) {
    const collection = await Collection.findOne({
      where: {
        id: collectionId
      }
    })

    if (!collection) {
      throw Errors.COLLECTION_NOT_FOUND
    }

    const user = await User.findOne({
      where: {
        username
      }
    })

    if (!user) {
      throw Errors.USER_NOT_FOUND
    }

    if (collection.userId === user.id) {
      throw Errors.CANNOT_ADD_OWNER
    }

    const friend = await Friend.findOne({
      where: {
        userId: senderId,
        friendId: user.id,
        status: "accepted"
      }
    })

    if (!friend) {
      throw Errors.NOT_FRIENDS_WITH_USER_COLLECTION
    }

    return {
      ...(
        await CollectionUser.create({
          collectionId,
          recipientId: user.id,
          senderId: senderId,
          write,
          configure,
          read,
          identifier: collectionId + "-" + user.id
        })
      ).dataValues,
      user,
      collection: {
        id: collection.id,
        name: collection.name
      }
    }
  }

  async updateUser(
    collectionId: number,
    recipientId: number,
    write: boolean,
    configure: boolean,
    read: boolean
  ) {
    const result = await CollectionUser.update(
      {
        write,
        configure,
        read
      },
      {
        where: {
          collectionId,
          recipientId
        }
      }
    )

    if (!result) throw Errors.COLLECTION_USER_NOT_FOUND

    return result
  }

  async updateShareLink(collectionId: number, type: "nobody" | "link") {
    switch (type) {
      case "link":
        const shareLink = cryptoRandomString({ length: 64 })
        await Collection.update(
          {
            shareLink
          },
          {
            where: {
              id: collectionId
            }
          }
        )
        return {
          shareLink
        }
      case "nobody":
        await Collection.update(
          {
            shareLink: null
          },
          {
            where: {
              id: collectionId
            }
          }
        )
        return {
          shareLink: null
        }
      default:
        throw Errors.INVALID_PARAMETERS
    }
  }

  async updatePin(id: number, collectionId: number) {
    const collectionItem = await CollectionItem.findOne({
      where: {
        id,
        collectionId
      }
    })

    if (!collectionItem) throw Errors.COLLECTION_ITEM_NOT_FOUND

    await collectionItem.update({
      pinned: !collectionItem.pinned
    })

    return {
      pinned: collectionItem.pinned
    }
  }

  async updateCollection(id: number, name: string) {
    const collection = await Collection.findOne({
      where: {
        id
      }
    })

    if (!collection) throw Errors.COLLECTION_NOT_FOUND

    await collection.update({
      name
    })

    return {
      name
    }
  }

  async updateBanner(id: number, banner: string | null) {
    const collection = await Collection.findOne({
      where: {
        id
      }
    })

    if (!collection) throw Errors.COLLECTION_NOT_FOUND

    await collection.update({
      image: banner
    })

    return {
      banner
    }
  }
}
