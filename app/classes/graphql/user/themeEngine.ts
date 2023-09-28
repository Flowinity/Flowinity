import { Field, InputType, ObjectType } from "type-graphql"

@ObjectType("ThemeEngineColors")
@InputType("ThemeEngineColorsInput")
export class ThemeEngineColors {
  @Field()
  primary: string
  @Field()
  logo1: string
  @Field()
  logo2: string
  @Field()
  secondary: string
  @Field()
  accent: string
  @Field()
  error: string
  @Field()
  info: string
  @Field()
  success: string
  @Field()
  warning: string
  @Field()
  card: string
  @Field()
  toolbar: string
  @Field()
  sheet: string
  @Field()
  text: string
  @Field()
  dark: string
  @Field()
  gold: string
  @Field()
  background: string
  @Field()
  background2: string
}

@ObjectType()
export class ThemeEngineVariables {
  @Field()
  "border-color": string
  @Field()
  "border-opacity": number
  @Field()
  "high-emphasis-opacity": number
  @Field()
  "medium-emphasis-opacity": number
  @Field()
  "disabled-opacity": number
  @Field()
  "idle-opacity": number
  @Field()
  "hover-opacity": number
  @Field()
  "focus-opacity": number
  @Field()
  "selected-opacity": number
  @Field()
  "activated-opacity": number
  @Field()
  "pressed-opacity": number
  @Field()
  "dragged-opacity": number
  @Field()
  "theme-kbd": string
  @Field()
  "theme-on-kbd": string
  @Field()
  "theme-code": string
  @Field()
  "theme-on-code": string
}

@ObjectType("ThemeEngineTheme")
@InputType("ThemeEngineThemeInput")
export class ThemeEngineTheme {
  @Field()
  colors: ThemeEngineColors
  @Field({
    nullable: true
  })
  dark: boolean
}
@ObjectType("ThemeEngineThemes")
@InputType("ThemeEngineThemesInput")
export class ThemeEngineThemes {
  @Field(() => ThemeEngineTheme)
  dark: ThemeEngineTheme
  @Field(() => ThemeEngineTheme)
  light: ThemeEngineTheme
  @Field(() => ThemeEngineTheme)
  amoled: ThemeEngineTheme
}

@ObjectType("ThemeEngine")
@InputType("ThemeEngineInput")
export class ThemeEngine {
  @Field(() => ThemeEngineThemes)
  theme: ThemeEngineThemes
  @Field()
  fluidGradient: boolean
  @Field()
  gradientOffset: string
  @Field(() => ThemeEngineThemes, {
    nullable: true
  })
  defaults: ThemeEngineThemes
  @Field()
  version: number
  @Field()
  deviceSync: boolean
  @Field()
  showOnProfile: boolean
  @Field()
  baseTheme: "dark" | "light" | "amoled"
  @Field({
    nullable: true
  })
  customCSS: string
}
