//"online" | "idle" | "busy" | "invisible"

import { registerEnumType } from "type-graphql"

export enum UserStoredStatus {
  ONLINE = "online",
  IDLE = "idle",
  BUSY = "busy",
  INVISIBLE = "invisible"
}

export enum UserStatus {
  ONLINE = "online",
  IDLE = "idle",
  OFFLINE = "offline",
  BUSY = "busy",
  UNKNOWN = "unknown"
}

registerEnumType(UserStoredStatus, {
  name: "UserStoredStatus",
  description:
    "User status/presence that has `invisible` and is shown to the current user."
})

registerEnumType(UserStatus, {
  name: "UserStatus",
  description: "User status/presence shown to other users."
})
