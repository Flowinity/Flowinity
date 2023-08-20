import { Field, InputType, ObjectType } from "type-graphql"
import { IsHexColor, IsNumber, IsUUID, Max, Min } from "class-validator"

@ObjectType("ProfileLayoutPropLink")
@InputType("ProfileLayoutPropLinkInput")
export class ProfileLayoutPropLink {
  @Field()
  name: string
  @Field()
  url: string
  @IsHexColor()
  @Field()
  color: string
}

@ObjectType("ProfileLayoutProps")
@InputType("ProfileLayoutPropsInput")
export class ProfileLayoutProps {
  @Field({
    nullable: true
  })
  @IsNumber()
  @Min(0)
  @Max(40)
  height?: number
  @Field(() => [ProfileLayoutComponent], {
    nullable: true
  })
  children?: ProfileLayoutComponent[]
  @Field({
    nullable: true
  })
  friendsOnly?: boolean
  @Field({
    nullable: true
  })
  display: number
  @Field({
    nullable: true
  })
  type?: string
  @Field(() => [ProfileLayoutPropLink], {
    nullable: true
  })
  links?: ProfileLayoutPropLink[]
}

@ObjectType("ProfileLayoutComponent")
@InputType("ProfileLayoutComponentInput")
export class ProfileLayoutComponent {
  @Field()
  name: string
  @IsUUID()
  @Field()
  id: string
  @Field(() => ProfileLayoutProps, {
    nullable: true
  })
  props?: ProfileLayoutProps
}

@ObjectType("ProfileLayoutColumn")
@InputType("ProfileLayoutColumnInput")
export class ProfileLayoutColumn {
  @Field(() => [ProfileLayoutComponent])
  rows: ProfileLayoutComponent[]
}

@ObjectType("ProfileLayoutObject")
@InputType("ProfileLayoutObjectInput")
export class ProfileLayoutObject {
  @Field(() => [ProfileLayoutColumn])
  columns: ProfileLayoutColumn[]
}

@ObjectType("ProfileLayoutConfig")
@InputType("ProfileLayoutConfigInput")
export class ProfileLayoutConfig {
  @Field({
    nullable: true
  })
  containerMargin?: number
  @Field()
  showStatsSidebar: boolean
}

@ObjectType("ProfileLayout")
@InputType("ProfileLayoutInput")
export class ProfileLayout {
  @Field(() => ProfileLayoutObject)
  layout: ProfileLayoutObject
  @Field(() => ProfileLayoutConfig)
  config: ProfileLayoutConfig
  @Field()
  version: number
}
