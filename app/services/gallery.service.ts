import { Service } from "typedi"
import { Upload } from "@app/models/upload.model"
import paginate from "jw-paginate"
import { Collection } from "@app/models/collection.model"
import { Op } from "sequelize"
import utils from "@app/lib/utils"
import { User } from "@app/models/user.model"
import sequelize from "@app/db"
import path from "path"
import { CollectionItem } from "@app/models/collectionItem.model"
import queue from "@app/lib/queue"
import { Star } from "@app/models/star.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import axios from "axios"

@Service()
export class GalleryService {
  async createUpload(userId: number, file: any, precache: boolean = false) {
    const upload = await Upload.create({
      attachment: file.filename, // Attachment hash
      userId: userId,
      originalFilename: file.originalname,
      name: file.originalname,
      type:
        utils.getTypeByExt(path.extname(file.originalname)?.split(".")[1]) ||
        "binary",
      fileSize: file.size,
      deletable: true
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
    await queue.queue.add(upload.id, upload)
    try {
      if (precache && config.discord?.token) {
        if (upload.type === "image" || upload.type === "video") {
          axios.post(config.discord.token, {
            content: url + " precache."
          })
        }
      }
    } catch {
      //
    }
    return {
      upload,
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
    userId?: number
  ): Promise<Object> {
    const offset = page * 12 - 12 || 0
    let base = {
      deletable: true
    }
    if (filter !== "all") {
      base["type"] = filter
    }
    if (type === "user") {
      base["userId"] = id
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
          model: CollectionItem,
          as: "item",
          where: {
            collectionId: id
          }
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        },
        {
          model: Collection,
          as: "collections"
        }
      ]
    } else if (type === "starred") {
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
    } else if (type === "autoCollect") {
      include = [
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
          as: "collections"
        }
      ]
    } else {
      include = [
        {
          model: Collection,
          as: "collections"
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        }
      ]
    }
    /*       {
          model: Collection,
          as: "collections"
        },*/
    let uploads = await Upload.findAll({
      where,
      include,
      limit: 12,
      offset,
      order: [["createdAt", "DESC"]]
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
    // TODO: FIX ME
    // this hack caused the performance to go from 30-90ms to 300ms per page
    /*for (let upload of uploads) {
      const items = await CollectionItem.findAll({
        where: {
          attachmentId: upload.id
        },
        include: [
          {
            model: Collection,
            as: "collection"
          }
        ]
      })
      upload.dataValues.collections = items.map(
        (item) => item.dataValues.collection
      )
    }*/
    const uploadCount = await Upload.count({
      where,
      include
    })
    const pager = paginate(uploadCount || uploads.length, page, 12)
    return {
      gallery: uploads,
      pager
    }
  }
}
