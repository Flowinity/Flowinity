import { z } from "zod"

export const ReportValidate = z.object({
  content: z.string().min(1).max(1000),
  email: z.string().email().optional().or(z.literal("")),
  tpuLink: z.string().url()
})
