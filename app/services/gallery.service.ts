import { Service } from "typedi"
import { Upload } from "@app/models/upload.model"
import paginate from "jw-paginate"
import { Collection } from "@app/models/collection.model"
import Sequelize, { Op } from "sequelize"
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
    await queue.queue?.add(upload.id, upload)
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
          attributes: ["id", "username", "avatar"]
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
          attributes: ["id", "name"]
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
          attributes: ["id", "name"]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
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
            attributes: ["id", "username"]
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
                attributes: ["id", "name"]
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
