import { Service } from "typedi"
import { Upload } from "@app/models/upload.model"
import paginate from "jw-paginate"
import { Collection } from "@app/models/collection.model"
import Sequelize, { Includeable, Op } from "sequelize"
import utils from "@app/lib/utils"
import { User } from "@app/models/user.model"
import sequelize from "@app/db"
import path from "path"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Star } from "@app/models/star.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import axios from "axios"
import * as fs from "fs"
import Errors from "@app/lib/errors"
import { Plan } from "@app/models/plan.model"
import { CacheService } from "@app/services/cache.service"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import {
  Filter,
  GalleryInput,
  Order,
  Type
} from "@app/classes/graphql/gallery/galleryInput"
import { PaginatedGalleryResponse } from "@app/classes/graphql/gallery/galleryResponse"
import { CollectionUser } from "@app/models/collectionUser.model"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"

@Service()
export class GalleryService {
  constructor(private readonly cacheService: CacheService) {}
  async getRandomAttachment(
    id: number,
    type: "user" | "collection" | "starred" = "user",
    userId?: number
  ): Promise<Upload> {
    let include: object[]

    switch (type) {
      case "collection":
        include = [
          {
            model: CollectionItem,
            as: "item",
            required: true,
            where: {
              collectionId: id
            }
          }
        ]
        break
      case "starred":
        include = [
          {
            model: Star,
            as: "starred",
            required: true,
            where: {
              userId: id
            }
          }
        ]
        break
      default:
        include = []
    }

    const where = type === "starred" || type === "user" ? { userId: id } : {}

    return await Upload.findOne({
      where: {
        ...where,
        deletable: true
      },
      include,
      // @ts-ignore
      order: [[sequelize.literal("RAND()")]]
    })
  }

  async deleteUpload(id: number, userId: number) {
    const upload = await Upload.findOne({
      where: {
        id,
        userId
      }
    })
    if (upload) {
      try {
        await fs.unlinkSync(global.storageRoot + upload.attachment)
      } catch (e) {
        console.log(e)
      }
      await User.update(
        {
          quota: sequelize.literal("quota -" + upload.fileSize)
        },
        {
          where: {
            id: userId
          }
        }
      )
      await CollectionItem.destroy({
        where: {
          attachmentId: id
        }
      })
      await Star.destroy({
        where: {
          attachmentId: id
        }
      })
      await AutoCollectApproval.destroy({
        where: {
          uploadId: id
        }
      })
      await upload.destroy()
      socket.of(SocketNamespaces.GALLERY).to(userId).emit("delete", id)

      return true
    } else {
      return false
    }
  }

  async createUpload(
    userId: number,
    file: any,
    precache: boolean = false,
    deletable: boolean = true
  ) {
    const upload = await Upload.create({
      attachment: file.filename, // Attachment hash
      userId: userId,
      originalFilename: file.originalname,
      name: file.originalname,
      type:
        utils.getTypeByExt(path.extname(file.originalname)?.split(".")[1]) ||
        "binary",
      fileSize: file.size,
      deletable
    })
    await User.update(
      {
        quota: sequelize.literal("quota +" + file.size)
      },
      {
        where: {
          id: userId
        }
      }
    )
    const url =
      "https://" + (await utils.getUserDomain(userId)) + upload.attachment
    await queue.queue?.add(upload.id.toString(), upload)
    try {
      if (precache && config.discord?.token && config.discord.webhook) {
        if (upload.type === "image" || upload.type === "video") {
          axios.post(config.discord.webhook, {
            content: url + " precache."
          })
        }
      }
    } catch {
      //
    }
    return {
      upload: await this.getAttachment(upload.attachment, userId),
      url
    }
  }

  async getGalleryV4(
    id: number | undefined,
    input: GalleryInput,
    limit: number = 12,
    excludedCollections: number[] | null
  ): Promise<PaginatedGalleryResponse> {
    let sortParams: any =
      input.order === Order.RANDOM
        ? [sequelize.literal("RAND()")]
        : [input.sort || "createdAt", input.order || "DESC"]

    const offset = input.page * limit - limit || 0
    const allowed = [
      Filter.IMAGES,
      Filter.VIDEOS,
      Filter.TEXT,
      Filter.OTHER,
      Filter.AUDIO,
      Filter.PASTE
    ]
    const type = input.filters?.filter((f) => allowed.includes(f))?.length
      ? {
          [Op.in]: input.filters?.filter((f) => allowed.includes(f))
        }
      : undefined
    let base: {
      [key: string]: any
    } = {
      deletable: input.filters?.includes(Filter.INCLUDE_DELETABLE)
        ? undefined
        : true,
      attachment: input.filters?.includes(Filter.GIFS)
        ? { [Op.like]: "%.gif" }
        : undefined,
      type,
      id:
        input.filters?.includes(Filter.NO_COLLECTION) && excludedCollections
          ? {
              [Op.notIn]: sequelize.literal(
                `(SELECT attachmentId FROM collectionItems WHERE collectionId NOT IN (${excludedCollections.join(
                  ","
                )}))`
              )
            }
          : undefined,
      userId: input.type !== Type.COLLECTION ? id : undefined,
      [Op.or]: [
        {
          textMetadata: Filter.INCLUDE_METADATA
            ? { [Op.like]: "%" + input.search + "%" }
            : undefined
        },
        {
          name: { [Op.like]: "%" + input.search + "%" }
        },
        { attachment: { [Op.like]: "%" + input.search + "%" } }
      ]
    }
    let include: Includeable[] = []
    switch (input.type) {
      case Type.COLLECTION:
        include = [
          {
            model: CollectionItem,
            as: "item",
            required: true,
            where: {
              collectionId: input.collectionId
            }
          }
        ]
        break
      case Type.STARRED:
        include = [
          {
            model: Star,
            as: "starred",
            required: true,
            where: {
              userId: id
            }
          }
        ]
        break
      case Type.AUTO_COLLECT:
        include = [
          {
            model: AutoCollectApproval,
            as: "autoCollectApproval",
            required: true,
            where: {
              userId: id,
              collectionId: input.collectionId
            }
          }
        ]
    }
    // delete undefined keys
    Object.keys(base).forEach(
      (key) => base[key] === undefined && delete base[key]
    )
    const uploads = await Upload.findAll({
      where: base,
      include,
      limit: limit || 12,
      offset,
      order: [sortParams]
    })
    const count = await Upload.count({
      where: base,
      include,
      distinct: true
    })
    const pager = paginate(count || uploads.length, input.page, limit)
    return {
      items: uploads,
      pager
    }
  }

  async getGallery(
    id: number,
    page: number = 1,
    search?: string,
    filter: string = "all",
    showMetadata: boolean = true,
    type: "user" | "collection" | "starred" | "autoCollect" = "user",
    itemsPerPage: number = 12,
    sort: "newest" | "oldest" | "size" = "newest",
    array: boolean = false,
    userId?: number,
    excludedCollections?: number[] | null
  ) {
    let sortParams: Sequelize.OrderItem = ["createdAt", "DESC"]
    if (sort === "oldest") {
      sortParams = ["createdAt", "ASC"]
    } else if (sort === "size") {
      sortParams = ["fileSize", "DESC"]
    }
    const offset = page * itemsPerPage - itemsPerPage || 0
    let base = {
      deletable: true
    } as {
      [key: string]: any
    }
    if (filter !== "all" && filter !== "gif" && filter !== "nonCollectivized") {
      base.type = filter
    }
    if (filter === "gif") {
      base.attachment = { [Op.like]: "%.gif" }
    }
    // if filter nonCollectivized it cannot belong in any collections
    if (filter === "nonCollectivized") {
      if (excludedCollections?.length) {
        base.id = {
          [Op.notIn]: sequelize.literal(
            `(SELECT attachmentId FROM collectionItems WHERE collectionId NOT IN (${excludedCollections.join(
              ","
            )}))`
          )
        }
      } else {
        base.id = {
          [Op.notIn]: sequelize.literal(
            "(SELECT attachmentId FROM collectionItems)"
          )
        }
      }
    }
    if (type === "user") {
      base.userId = id
    }
    const metadata = {
      [Op.or]: [
        {
          originalFilename: { [Op.like]: "%" + search + "%" }
        },
        { attachment: { [Op.like]: "%" + search + "%" } },
        { data: { [Op.like]: "%" + search + "%" } },
        { textMetadata: { [Op.like]: "%" + search + "%" } }
      ]
    }
    const noMetadata = {
      [Op.or]: [
        {
          originalFilename: { [Op.like]: "%" + search + "%" }
        },
        { attachment: { [Op.like]: "%" + search + "%" } },
        { data: { [Op.like]: "%" + search + "%" } }
      ]
    }
    const where = showMetadata
      ? { ...base, ...metadata }
      : { ...base, ...noMetadata }
    let include: object = []
    if (type === "collection") {
      include = [
        {
          model: Star,
          as: "starred",
          required: false,
          where: {
            userId: userId
          }
        },
        {
          model: CollectionItem,
          as: "item",
          required: true,
          where: {
            collectionId: id
          }
        }
      ]
    } else if (type === "starred") {
      include = [
        {
          model: Collection,
          as: "collections",
          attributes: ["id", "name"]
        },
        {
          model: Star,
          as: "starred",
          required: true,
          where: {
            userId: id
          }
        },
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ]
    } else if (type === "autoCollect") {
      include = [
        {
          model: Star,
          as: "starred",
          required: false,
          where: {
            userId: userId
          }
        },
        {
          model: AutoCollectApproval,
          as: "autoCollectApproval",
          required: true,
          where: {
            userId: userId,
            collectionId: id
          }
        },
        {
          model: Collection,
          as: "collections",
          attributes: ["id", "name", "userId"],
          required: false,
          where: {
            [Op.or]: [
              {
                userId: userId ?? 0
              }
            ]
          },
          include: [
            {
              model: CollectionUser,
              as: "recipient",
              attributes: ["recipientId"],
              required: false,
              where: {
                recipientId: userId ?? 0
              }
            }
          ]
        }
      ]
    } else {
      include = [
        {
          model: Star,
          as: "starred",
          required: false,
          where: {
            userId: id
          }
        },
        {
          model: Collection,
          as: "collections",
          attributes: ["id", "name", "userId"]
        },
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ]
    }
    let uploads
    if (type === "collection") {
      uploads = await CollectionItem.findAll({
        where: {
          collectionId: id
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: partialUserBase
          },
          {
            model: Upload,
            as: "attachment",
            where,
            required: true,
            include: [
              {
                model: Collection,
                as: "collections",
                attributes: ["id", "name", "userId"]
              }
            ]
          }
        ],
        offset,
        limit: itemsPerPage,
        order: [["pinned", "DESC"], sortParams]
      })
      uploads = uploads.map((upload: any) => {
        return {
          item: {
            ...upload.toJSON(),
            attachment: null
          },
          user: upload.user.toJSON(),
          ...upload.attachment.toJSON()
        }
      })
    } else {
      uploads = await Upload.findAll({
        where,
        include,
        limit: itemsPerPage,
        offset,
        order: [sortParams]
        /* type === "collection"
            ? [
                [
                  {
                    model: CollectionItem,
                    as: "item"
                  },
                  "pinned",
                  "DESC"
                ],
                ["createdAt", "DESC"]
              ]
            : [["createdAt", "DESC"]]*/
      })
    }
    if (array) return uploads
    let uploadCount
    if (type === "collection") {
      uploadCount = await CollectionItem.count({
        where: {
          collectionId: id
        },
        distinct: true,
        include: [
          {
            model: Upload,
            as: "attachment",
            where,
            required: true
          }
        ]
      })
    } else {
      uploadCount = await Upload.count({
        where,
        include,
        distinct: true
      })
    }
    const pager = paginate(uploadCount || uploads.length, page, itemsPerPage)
    return {
      gallery: uploads,
      pager
    }
  }

  async starUpload(attachment: string, userId: number) {
    const upload = await Upload.findOne({
      where: {
        attachment
      }
    })
    if (!upload) {
      throw Errors.ATTACHMENT_NOT_FOUND_ROUTE
    }
    const star = await Star.findOne({
      where: {
        userId,
        attachmentId: upload.id
      }
    })
    if (star) {
      await star.destroy()
      return {
        status: false,
        star: null
      }
    } else {
      const star = await Star.create({
        userId,
        attachmentId: upload.id
      })
      return {
        status: true,
        star
      }
    }
  }

  async getAttachment(attachment: string, userId?: number) {
    const upload = await Upload.findOne({
      where: {
        attachment
      },
      include: [
        {
          model: Star,
          as: "starred",
          required: false,
          where: {
            userId: userId || 0
          }
        },
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "username",
            "avatar",
            "administrator",
            "moderator",
            "planId",
            "createdAt",
            "updatedAt"
          ],
          include: [
            {
              model: Plan,
              as: "plan"
            }
          ]
        }
      ]
    })
    if (!upload) {
      throw Errors.ATTACHMENT_NOT_FOUND_ROUTE
    }
    upload.dataValues.collections = []
    return upload
  }

  async getAttachmentsByCollectionId(collectionId: number): Promise<Upload[]> {
    const uploads = await Upload.findAll({
      include: [
        {
          model: Collection,
          as: "collections",
          where: {
            id: collectionId
          }
        }
      ]
    })

    if (!uploads) throw Errors.ATTACHMENT_NOT_FOUND_ROUTE

    return uploads
  }
}
