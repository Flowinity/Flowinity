import { FieldResolver, Resolver, Root } from "type-graphql"
import { Collection } from "@app/models/collection.model"
import { Service } from "typedi"
import { CollectionItem } from "@app/models/collectionItem.model"

@Resolver(CollectionItem)
@Service()
export class CollectionItemResolver {
  @FieldResolver(() => Collection)
  async collection(@Root() collectionItem: CollectionItem) {
    return await collectionItem.$get("collection")
  }
}
