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
//import { CollectionPin } from "@app/models/collectionPin.model"
import queue from "@app/lib/queue"

@Service()
export class GalleryService {
  async createUpload(userId: number, file: any) {
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
    await queue.queue.add(upload.id, upload)
    return {
      upload,
      url: "https://" + (await utils.getUserDomain(userId)) + upload.attachment
    }
  }
  async getGallery(
    id: number,
    page: number = 1,
    search?: string,
    filter: string = "all",
    showMetadata: boolean = true,
    type: "user" | "collection" | "starred" | "autoCollect" = "user"
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
          },
          attributes: ["id"],
          required: true,
          include: [
            /*{
              model: CollectionPin,
              as: "pinned",
              required: false,
              where: {
                collectionId: id
              }
            }*/
          ]
        },
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
    const uploads = await Upload.findAll({
      where,
      include,
      limit: 12,
      offset,
      order: [["createdAt", "DESC"]]
    })
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
