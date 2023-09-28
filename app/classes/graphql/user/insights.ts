import { registerEnumType } from "type-graphql"

export enum UserInsights {
  EVERYONE = "everyone",
  FRIENDS = "friends",
  NOBODY = "nobody"
}

registerEnumType(UserInsights, {
  name: "UserInsights",
  description: "Insights privacy preference."
})
