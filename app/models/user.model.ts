import {
  Table,
  Column,
  Model,
  //BelongsTo,
  Default,
  AllowNull,
  DefaultScope,
  BelongsTo
} from "sequelize-typescript"
import { Plan } from "@app/models/plan.model"

@DefaultScope(() => ({
  attributes: {
    exclude: ["password", "totpSecret"]
  }
}))
@Table
export class User extends Model {
  @Column
  username: string

  @Column
  email: string

  @Column
  password: string

  @Column
  description?: string

  @Default(false)
  @Column
  administrator: boolean

  @Default(true)
  @Column
  darkTheme: boolean

  /*@Default(false)
  @Column
  emailVerified: boolean*/

  @Default(false)
  @Column
  banned: boolean

  @Column
  inviteId?: number

  @Default({
    enabled: false,
    color: "#0190ea",
    siteName: "TroploPrivateUploader",
    siteURL: "https://images.flowinity.com",
    author: "",
    authorURL: null,
    title: "[attachment.name]",
    description: "Uploaded by [user.username]",
    customFields: []
  })
  @Column({
    type: "json"
  })
  openGraph: OpenGraph

  @AllowNull
  @Column
  avatar?: string

  @Default(1)
  @Column
  subdomainId?: number

  @Default(false)
  @Column
  totpEnable: boolean

  @AllowNull
  @Column
  totpSecret?: string

  @Default(0)
  @Column
  quota: bigint

  @Default(false)
  @Column
  uploadNameHidden: boolean

  @Default(false)
  @Column
  invisibleURLs: boolean

  @Default(false)
  @Column
  moderator: boolean

  @Default(1)
  @Column
  subscriptionId: number

  @AllowNull
  @Column
  fakePath?: string

  @Default(1)
  @Column
  themeId: number

  @BelongsTo(() => Plan, "planId")
  plan: Plan
}
