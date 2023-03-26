import { z } from "zod"

export const ThemeValidate = z.object({
  colors: z.object({
    primary: z.string().min(4).max(9).regex(/^#/),
    logo1: z.string().min(4).max(9).regex(/^#/),
    logo2: z.string().min(4).max(9).regex(/^#/),
    secondary: z.string().min(4).max(9).regex(/^#/),
    accent: z.string().min(4).max(9).regex(/^#/),
    error: z.string().min(4).max(9).regex(/^#/),
    info: z.string().min(4).max(9).regex(/^#/),
    success: z.string().min(4).max(9).regex(/^#/),
    warning: z.string().min(4).max(9).regex(/^#/),
    card: z.string().min(4).max(9).regex(/^#/),
    toolbar: z.string().min(4).max(9).regex(/^#/),
    sheet: z.string().min(4).max(9).regex(/^#/),
    text: z.string().min(4).max(9).regex(/^#/),
    dark: z.string().min(4).max(9).regex(/^#/),
    gold: z.string().min(4).max(9).regex(/^#/),
    background: z.string().min(4).max(9).regex(/^#/),
    background2: z.string().min(4).max(9).regex(/^#/)
  }),
  dark: z.boolean().optional()
})

export const ThemeEngineValidate = z
  .object({
    theme: z.object({
      dark: ThemeValidate,
      light: ThemeValidate,
      amoled: ThemeValidate
    }),
    fluidGradient: z.boolean(),
    gradientOffset: z.string(),
    defaults: z.any(),
    version: z.number(),
    deviceSync: z.boolean(),
    showOnProfile: z.boolean(),
    baseTheme: z.literal("dark").or(z.literal("light")).or(z.literal("amoled")),
    customCSS: z.string().nullable()
  })
  .nullable()
