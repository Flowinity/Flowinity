import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  UseBefore
} from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { GalleryService } from "@app/services/gallery.service"
import rateLimits from "@app/lib/rateLimits"
import { AutoCollectService } from "@app/services/autoCollect.service"
import { CacheService } from "@app/services/cache.service"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { SortOptions } from "@app/types/sort"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { ActOnAutoCollectAction } from "@app/classes/graphql/autoCollects/actOnAutoCollectsInput"

@Service()
@JsonController("/autoCollects")
export class AutoCollectControllerV3 {
  constructor(
    private readonly autoCollectService: AutoCollectService,
    private readonly galleryService: GalleryService,
    private readonly cacheService: CacheService
  ) {}

  currentEpoch() {
    return new Date().getTime()
  }

  @Get("")
  async getAutoCollects(@Auth("collections.view") user: User) {
    return await this.autoCollectService.getAutoCollects(user.id)
  }

  @Get("/rules")
  async getAutoCollectRules(@Auth("collections.view") user: User) {
    return await this.autoCollectService.getUserAutoCollectRules(user.id)
  }

  @Post("/rules")
  @UseBefore(rateLimits.standardLimiter)
  async createAutoCollectRule(
    @Auth("collections.create") user: User,
    @Body() body: AutoCollectRule
  ) {
    return await AutoCollectRule.create({
      userId: user.id,
      name: body.name,
      enabled: body.enabled,
      collectionId: body.collectionId,
      requireApproval: body.requireApproval,
      rules: [
        {
          id: this.currentEpoch(),
          rules: [
            {
              id: this.currentEpoch(),
              type: "metadata",
              value: "Change me",
              operator: "contains"
            }
          ]
        }
      ]
    })
  }

  @Delete("/rules/:ruleId")
  async deleteAutoCollectRule(
    @Auth("collections.create") user: User,
    @Param("ruleId") ruleId: number
  ) {
    const rule = await AutoCollectRule.findOne({
      where: {
        userId: user.id,
        id: ruleId
      }
    })
    if (!rule) throw Errors.COLLECTION_ITEM_NOT_FOUND
    await rule.destroy()
  }

  @Put("/rules/:ruleId")
  async updateAutoCollectRule(
    @Auth("collections.modify") user: User,
    @Param("ruleId") ruleId: number,
    @Body() body: AutoCollectRule
  ) {
    const rule = await AutoCollectRule.findOne({
      where: {
        id: ruleId,
        userId: user.id
      }
    })
    if (!rule) throw Errors.COLLECTION_ITEM_NOT_FOUND
    await rule.update({
      name: body.name,
      enabled: body.enabled,
      collectionId: body.collectionId,
      requireApproval: body.requireApproval,
      rules: body.rules
    })
    return rule
  }

  @Get("/:collectionId")
  async getAutoCollectGallery(
    @Auth("collections.view") user: User,
    @Param("collectionId") collectionId: number,
    @QueryParam("page") page: number = 1,
    @QueryParam("sort") sort: SortOptions = "newest",
    @QueryParam("search") search: string = "",
    @QueryParam("array") array: boolean = false,
    @QueryParam("textMetadata") textMetadata: boolean = false,
    @QueryParam("filter") filter: string = ""
  ) {
    return await this.galleryService.getGallery(
      collectionId,
      page,
      search,
      filter,
      textMetadata,
      "autoCollect",
      user.itemsPerPage,
      sort,
      array,
      user.id
    )
  }

  @Post("/bulk")
  @UseBefore(rateLimits.standardLimiter)
  async bulkActOnAutoCollect(
    @Auth("collections.modify") user: User,
    @Body() body: { ids: number[]; action: "approve" | "deny" }
  ) {
    const autoCollects = await AutoCollectApproval.findAll({
      where: {
        userId: user.id,
        id: body.ids
      }
    })

    console.log(body.ids)

    for (const autoCollect of autoCollects) {
      await this.autoCollectService.actAutoCollect(
        user.id,
        autoCollect,
        body.action === "approve"
          ? ActOnAutoCollectAction.APPROVE
          : ActOnAutoCollectAction.REJECT
      )
      await this.cacheService.patchAutoCollectCache(
        user.id,
        autoCollect.collectionId,
        autoCollect.id
      )
    }

    const collectionIds = Array.from(
      new Set(autoCollects.map((autoCollect) => autoCollect.collectionId))
    )
    for (const collectionId of collectionIds) {
      await queue.cacheQueue?.add(String(collectionId), collectionId, {
        delay: 30000,
        jobId: collectionId + "-autoCollect"
      })
    }
  }

  @Post("/:id")
  async actOnAutoCollect(
    @Auth("collections.modify") user: User,
    @Param("id") id: number,
    @Body() body: { action: "approve" | "deny" }
  ) {
    const autoCollect = await AutoCollectApproval.findOne({
      where: {
        userId: user.id,
        id
      }
    })
    if (!autoCollect) throw Errors.COLLECTION_ITEM_NOT_FOUND
    await this.autoCollectService.actAutoCollect(
      user.id,
      autoCollect,
      body.action === "approve"
        ? ActOnAutoCollectAction.APPROVE
        : ActOnAutoCollectAction.REJECT
    )
    await this.cacheService.patchAutoCollectCache(
      user.id,
      autoCollect.collectionId,
      autoCollect.id
    )
    await queue.cacheQueue?.add(
      String(autoCollect.collectionId),
      autoCollect.collectionId,
      {
        delay: 30000,
        jobId: autoCollect.collectionId + "-autoCollect"
      }
    )
  }
}
