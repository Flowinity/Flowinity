import { Service } from "typedi"
import { Upload } from "@app/models/upload"
import paginate from "jw-paginate"
import { Collection } from "@app/models/collection.model"

@Service()
export class GalleryService {
  async getGallery(userId: number, page: number = 1): Promise<Object> {
    const offset = page * 12 - 12 || 0
    const uploads = await Upload.findAll({
      where: {
        userId,
        deletable: true
      },
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
      where: {
        userId,
        deletable: true
      }
    })
    const pager = paginate(uploadCount || uploads.length, page, 12)
    return {
      gallery: uploads,
      pager
    }
  }
}
