import {z} from "zod"

export const ExcludedCollectionsValidate = z
    .array(z.number().int())
    .max(24)
    .nullable()
