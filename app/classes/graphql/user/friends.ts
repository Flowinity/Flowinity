import { registerEnumType } from "type-graphql"

export enum FriendStatus {
  NONE = "none",
  INCOMING = "incoming",
  OUTGOING = "outgoing",
  ACCEPTED = "accepted"
}

registerEnumType(FriendStatus, {
  name: "FriendStatus",
  description: "Friend request status."
})
