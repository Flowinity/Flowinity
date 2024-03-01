import { Field, ObjectType } from "type-graphql"
import { BelongsTo } from "sequelize-typescript"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { User } from "@app/models/user.model"

@ObjectType()
export class OauthConsentApp {
  @Field()
  id: string

  @Field()
  name: string

  @Field({
    nullable: true
  })
  icon: string

  @Field({
    nullable: true
  })
  shortCode: string

  @Field()
  verified: boolean

  @Field({
    nullable: true
  })
  redirectUri: string

  @Field({
    nullable: true
  })
  description: string

  @Field()
  scopes: string

  @Field()
  userId: number

  @Field({
    nullable: true
  })
  botId: number

  @Field()
  private: boolean

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: PartialUserBase

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "botId")
  bot: PartialUserBase

  @Field(() => String, {
    nullable: true
  })
  token?: string
}
