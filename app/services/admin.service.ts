import { Service } from "typedi"
import { CacheService } from "@app/services/cache.service"
export enum CacheType {
  "everything",
  "state",
  "collections",
  "sharelinks"
}
@Service()
export class AdminService {
  constructor(private readonly cacheService: CacheService) {}
  async getStats() {
    //TODO
    return {}
  }

  async purgeCache(type: CacheType) {
    switch (type) {
      case CacheType.everything:
        await this.cacheService.refreshState()
        await this.cacheService.generateCollectionCache()
        await this.cacheService.generateShareLinkCache()
        return true
      case CacheType.state:
        await this.cacheService.refreshState()
        return true
      case CacheType.collections:
        await this.cacheService.generateCollectionCache()
        return true
      case CacheType.sharelinks:
        await this.cacheService.generateShareLinkCache()
        return true
      default:
        return false
    }
  }

  async purgeUserCache(id: number) {
    await this.cacheService.generateCollectionCacheForUser(id)
    return true
  }
}
