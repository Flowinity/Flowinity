import { Service } from "typedi"
import { Upload } from "@app/models/upload"
import paginate from "jw-paginate"
import { Collection } from "@app/models/collection.model"
import { Op } from "sequelize"
import utils from "@app/lib/utils"
import { User } from "@app/models/user.model"
import sequelize from "@app/db"
@Service()
export class GalleryService {
  async createUpload(userId: number, file: any) {
    const upload = await Upload.create({
      attachment: file.filename, // Attachment hash
      UserId: userId,
      originalFilename: file.originalname,
      name: file.originalname,
      type: utils.getTypeByExt(file.extname) || "binary",
      fileSize: file.size
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
    utils.postUpload(upload)
    return {
      upload,
      url: (await utils.getUserDomain(userId)) + upload.attachment
    }
  }
  async getGallery(
    userId: number,
    page: number = 1,
    search?: string,
    filter: string = "all",
    showMetadata: boolean = true
  ): Promise<Object> {
    const offset = page * 12 - 12 || 0
    const base = {
      userId,
      deletable: true
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
    const uploads = await Upload.findAll({
      where,
      include: [
        {
          model: Collection,
          as: "collections"
        }
      ],
      limit: 12,
      offset,
      order: [["createdAt", "DESC"]]
    })
    const uploadCount = await Upload.count({
      where
    })
    const pager = paginate(uploadCount || uploads.length, page, 12)
    return {
      gallery: uploads,
      pager
    }
  }
}
