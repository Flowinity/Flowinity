import { z } from "zod"

export const HexValidate = z.string().regex(/^#([0-9a-f]{3}){1,2}$/i)
export const HexValidateOptional = HexValidate.nullable()
