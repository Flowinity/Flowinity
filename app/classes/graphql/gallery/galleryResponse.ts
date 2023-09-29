import { ClassType, Field, Int, ObjectType } from "type-graphql"
import { Upload } from "@app/models/upload.model"

@ObjectType()
export class Pager {
  @Field(() => Int)
  totalItems: number
  @Field(() => Int)
  currentPage: number
  @Field(() => Int)
  pageSize: number
  @Field(() => Int)
  totalPages: number
  @Field(() => Int)
  startPage: number
  @Field(() => Int)
  endPage: number
  @Field(() => Int)
  startIndex: number
  @Field(() => Int)
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
