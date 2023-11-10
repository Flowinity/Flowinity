import { Field, InputType, Int, registerEnumType } from "type-graphql"
import { CacheType } from "@app/enums/admin/CacheType"

registerEnumType(CacheType, {
  name: "AdminCacheType",
  description: "The type of cache to clear"
})

@InputType()
export class ClearCacheInput {
  @Field(() => Int, {
    nullable: true
  })
  userId?: number
  @Field(() => CacheType)
  type: CacheType
  @Field(() => Boolean, {
    defaultValue: false,
    nullable: true
  })
  await: boolean
}
