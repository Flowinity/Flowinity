import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  HasMany,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Session } from "@app/models/session.model"
import { OauthUser } from "@app/models/oauthUser.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@DefaultScope(() => ({
  attributes: {
    exclude: ["secret"]
  }
}))
@Table
export class OauthApp extends Model {
  @Field()
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Field()
  @Column
  name: string

  @Field({
    nullable: true
  })
  @Column
  icon: string

  @Field({
    nullable: true
  })
  @Column
  shortCode: string

  @Field()
  @Column
  verified: boolean

  @Field({
    nullable: true
  })
  @Column
  redirectUri: string

  @Field({
    nullable: true
  })
  @Column
  secret: string

  @Field({
    nullable: true
  })
  @Column
  description: string

  @Field()
  @Column({
    defaultValue: "oauth.user.username,oauth.user.id,oauth.user.email"
  })
  scopes: string

  @Field()
  @Column
  userId: number

  @Field({
    nullable: true
  })
  @Column
  botId: number

  @Field()
  @Column
  private: boolean

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: PartialUserBase

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "botId")
  bot: PartialUserBase

  @HasMany(() => Session, "oauthAppId")
  sessions: Session[]

  @Field(() => [OauthUser])
  @HasMany(() => OauthUser, "oauthAppId")
  oauthUsers: OauthUser[]

  @Field(() => String, {
    nullable: true
  })
  token?: string
}
