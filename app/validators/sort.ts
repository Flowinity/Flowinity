import { z } from "zod"

export const SortValidate = z.object({
  sort: z.string().refine((value) => {
    return ["id", "createdAt", "updatedAt", "planId", "username"].includes(
      value
    )
  }),
  order: z.string().refine((value) => {
    return ["asc", "desc", "ASC", "DESC"].includes(value)
  })
})
