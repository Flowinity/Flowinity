import { Service } from "typedi"
import { Slideshow } from "@app/models/slideshow.model"
import { Upload } from "@app/models/upload.model"
import Errors from "@app/lib/errors"
import { CollectionCache } from "@app/types/collection"
import { Sequelize } from "sequelize-typescript"
import { CollectionItem } from "@app/models/collectionItem.model"

@Service()
export class SlideshowService {
  async getSlideshows(userId: number): Promise<Slideshow[]> {
    return await Slideshow.findAll({
      where: {
        userId
      }
    })
  }

  async renderSlideshow(shareLink: string): Promise<CollectionItem[]> {
    const slideshow = await Slideshow.findOne({
      where: {
        shareLink
      }
    })

    if (!slideshow) {
      throw Errors.SLIDESHOW_NOT_FOUND
    }

    let collectionIds = await redis.json.get(`collections:${slideshow.userId}`)

    collectionIds = collectionIds.map(
      (collection: CollectionCache) => collection.id
    )

    const slideshowCollectionIds = slideshow.collectionIds.filter(
      (id) => collectionIds.indexOf(id) !== -1
    )

    return await CollectionItem.findAll({
      where: {
        collectionId: slideshowCollectionIds
      },
      include: [
        {
          model: Upload,
          as: "attachment",
          required: true
        }
      ],
      // @ts-ignore
      order: [[Sequelize.literal("RAND()")]],
      limit: 15
    })
  }

  async getSlideshowConfig(shareLink: string): Promise<Slideshow> {
    const slideshow = await Slideshow.findOne({
      where: {
        shareLink
      }
    })

    if (!slideshow) {
      throw Errors.SLIDESHOW_NOT_FOUND
    }

    return slideshow
  }
}
