import { registerEnumType } from "type-graphql"

export enum PermissionGroup {
  "ADMIN" = "ADMIN",
  "MANAGE" = "MANAGE",
  "GENERAL" = "GENERAL",
  "OPTIONS" = "OPTIONS"
}

registerEnumType(PermissionGroup, {
  name: "RankPermissionGroup",
  description:
    "The category that the permission is categorized into for Communications ranks."
})
