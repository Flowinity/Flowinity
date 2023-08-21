import { Field, InputType, registerEnumType } from "type-graphql"
import { IsEnum, IsNumber, Max, Min } from "class-validator"

export enum Filter {
  ALL = "all",
  OWNED = "owned",
  SHARED = "shared",
  NO_COLLECTION = "notCollectivized",
  IMAGES = "image",
  VIDEOS = "video",
  GIFS = "gif",
  AUDIO = "audio",
  TEXT = "text",
  OTHER = "binary",
  PASTE = "paste",
  INCLUDE_METADATA = "metadata",
  INCLUDE_DELETABLE = "deletable"
}

export enum Sort {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  NAME = "name",
  SIZE = "fileSize"
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC"
}

export enum Type {
  PERSONAL,
  STARRED,
  COLLECTION
}

registerEnumType(Filter, {
  name: "GalleryFilter",
  description: "The filter to apply to the gallery request"
})

registerEnumType(Sort, {
  name: "GallerySort",
  description: "The sort to apply to the gallery request"
})

registerEnumType(Order, {
  name: "GalleryOrder",
  description: "The order to apply to the gallery request"
})

registerEnumType(Type, {
  name: "GalleryType",
  description:
    "The type of gallery request, for example if it's the personal gallery page, or a Collection"
})

@InputType()
export class GalleryInput {
  @Field({
    nullable: true,
    defaultValue: ""
  })
  search: string
  @Field(() => Number, {
    nullable: true,
    defaultValue: 1
  })
  page: number
  @IsNumber()
  @Min(1)
  @Max(100)
  @Field(() => Number, {
    nullable: true
  })
  limit: number
  @IsEnum(Filter, {
    each: true
  })
  @Field(() => [Filter], {
    nullable: true,
    defaultValue: [Filter.ALL]
  })
  filters?: Filter[]
  @IsEnum(Sort)
  @Field(() => Sort, {
    nullable: true,
    defaultValue: Sort.CREATED_AT
  })
  sort?: Sort
  @IsEnum(Order)
  @Field(() => Order, {
    nullable: true,
    defaultValue: Order.DESC
  })
  order?: Order
  @IsEnum(Type)
  @Field(() => Type, {
    nullable: true,
    defaultValue: Type.PERSONAL
  })
  type?: Type
  @IsNumber()
  @Field(() => Number, {
    nullable: true,
    description: "Requires Type to be COLLECTION"
  })
  collectionId?: number
  @Field({
    nullable: true,
    description: "Requires Type to be COLLECTION"
  })
  shareLink?: string
}
