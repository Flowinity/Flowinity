import { Service } from "typedi"
import cache from "@app/lib/cache"
export enum CacheType {
  "everything",
  "state",
  "collections",
  "sharelinks"
}
@Service()
export class AdminService {
  async getStats() {
    //TODO
    return {}
  }

  async purgeCache(type: CacheType) {
    switch (type) {
      case CacheType.everything:
        await cache.refreshState()
        await cache.generateCollectionCache()
        await cache.generateShareLinkCache()
        return true
      case CacheType.state:
        await cache.refreshState()
        return true
      case CacheType.collections:
        await cache.generateCollectionCache()
        return true
      case CacheType.sharelinks:
        await cache.generateShareLinkCache()
        return true
      default:
        return false
    }
  }

  async purgeUserCache(id: number) {
    await cache.generateCollectionCacheForUser(id)
    return true
  }
}
