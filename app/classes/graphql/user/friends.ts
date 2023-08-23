import { registerEnumType } from "type-graphql"

export enum FriendStatus {
  INCOMING = "incoming",
  OUTGOING = "outgoing",
  ACCEPTED = "accepted"
}

registerEnumType(FriendStatus, {
  name: "FriendStatus",
  description: "Friend request status."
})
