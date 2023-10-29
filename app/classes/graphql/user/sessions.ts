import { registerEnumType } from "type-graphql"

export enum SessionType {
  API = "api",
  WEB_SESSION = "session",
  OAUTH = "oauth"
}

registerEnumType(SessionType, {
  name: "SessionType"
})
