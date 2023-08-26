import { ClassType, Field, ObjectType } from "type-graphql"
import { Upload } from "@app/models/upload.model"

@ObjectType()
export class Pager {
  @Field(() => Number)
  totalItems: number
  @Field(() => Number)
  currentPage: number
  @Field(() => Number)
  pageSize: number
  @Field(() => Number)
  totalPages: number
  @Field(() => Number)
  startPage: number
  @Field(() => Number)
  endPage: number
  @Field(() => Number)
  startIndex: number
  @Field(() => Number)
  endIndex: number
  @Field(() => [Number])
  pages: number[]
}

export function PagerResponse<TItem extends object>(
  TItemClass: ClassType<TItem>
) {
  @ObjectType(`Paginated${TItemClass.name}Response`)
  abstract class PaginatedResponseClass {
    @Field((type) => [TItemClass])
    items: TItem[]

    @Field((type) => Pager)
    pager: Pager
  }
  return PaginatedResponseClass
}

export const PaginatedGalleryResponse = PagerResponse(Upload)
export type PaginatedGalleryResponse = InstanceType<
  typeof PaginatedGalleryResponse
>
