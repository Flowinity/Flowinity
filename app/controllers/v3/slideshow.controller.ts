import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put
} from "routing-controllers"
import { Service } from "typedi"
import { SlideshowService } from "@app/services/slideshow.service"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import { Slideshow } from "@app/models/slideshow.model"
import cryptoRandomString from "crypto-random-string"
import Errors from "@app/lib/errors"

@Service()
@JsonController("/slideshows")
export class SlideshowControllerV3 {
  constructor(private readonly slideshowService: SlideshowService) {}

  @Get("")
  async getSlideshows(@Auth("uploads.view") user: User) {
    return await this.slideshowService.getSlideshows(user.id)
  }

  @Post("")
  async createSlideshow(@Auth("uploads.create") user: User) {
    return await Slideshow.create({
      name: "New Slideshow",
      userId: user.id,
      shareLink: cryptoRandomString({ length: 128 }),
      collectionIds: [],
      includeGallery: false,
      speed: 5
    })
  }

  @Put("/:id")
  async updateSlideshow(
    @Auth("uploads.modify") user: User,
    @Param("id") id: number,
    @Body() body: Slideshow
  ) {
    const slideshow = await Slideshow.findOne({
      where: {
        id,
        userId: user.id
      }
    })

    if (!slideshow) {
      throw Errors.SLIDESHOW_NOT_FOUND
    }

    // While the user may be able to supply any collection ID without validation, validation comes later when the slideshow is rendered to avoid exposure.
    return await slideshow.update({
      name: body.name,
      collectionIds: body.collectionIds,
      includeGallery: body.includeGallery,
      speed: body.speed,
      scaling: body.scaling,
      showCaptions: body.showCaptions
    })
  }

  @Get("/:shareLink")
  async getSlideshow(@Param("shareLink") shareLink: string) {
    return await this.slideshowService.renderSlideshow(shareLink)
  }

  @Get("/:shareLink/config")
  async getSlideshowConfig(@Param("shareLink") shareLink: string) {
    return await this.slideshowService.getSlideshowConfig(shareLink)
  }

  @Delete("/:id")
  async deleteSlideshow(
    @Auth("uploads.modify") user: User,
    @Param("id") id: number
  ) {
    const slideshow = await Slideshow.findOne({
      where: {
        id,
        userId: user.id
      }
    })

    if (!slideshow) {
      throw Errors.SLIDESHOW_NOT_FOUND
    }

    await slideshow.destroy()
  }
}
