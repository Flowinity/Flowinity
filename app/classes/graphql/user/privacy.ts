import { registerEnumType } from "type-graphql"

export enum GroupPrivacy {
  FRIENDS = "FRIENDS",
  NOBODY = "NOBODY"
}

registerEnumType(GroupPrivacy, {
  name: "UserGroupPrivacy",
  description: "Preference of who can add them directly into groups."
})

export enum FriendRequestPrivacy {
  EVERYONE = "EVERYONE",
  NOBODY = "NOBODY"
}

registerEnumType(FriendRequestPrivacy, {
  name: "UserFriendRequestPrivacy",
  description: "Preference of who can send them friend requests."
})
