import { InferAttributes, InferCreationAttributes, Model } from "sequelize"

declare class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  id: number
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  description?: string
  administrator: boolean
  darkTheme: boolean
  emailVerified: boolean
  banned: boolean
  inviteId?: number
  openGraph: OpenGraph
  avatar?: string
  subdomainId?: number
  totpEnable: boolean
  totpSecret?: string
  quota: bigint
  uploadNameHidden: boolean
  invisibleURLs: boolean
  moderator: boolean
  subscriptionId: number
  fakePath?: string
  themeId: number
}
