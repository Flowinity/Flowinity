import { registerEnumType } from "type-graphql"

export enum SocketEvents {
  NEW_MESSAGE = "newMessage",
  EDIT_MESSAGE = "editMessage",
  DELETE_MESSAGE = "deleteMessage",
  PIN_MESSAGE = "pinMessage",
  NEW_CHAT = "newChat",
  EDIT_CHAT = "editChat",
  USER_STATUS = "userStatus",
  ACK = "ack",
  USER_SETTINGS = "userSettings"
}

registerEnumType(SocketEvents, {
  name: "SocketEvents",
  description: "The type of socket event."
})

export enum SocketNamespaces {
  CHAT = "/chat",
  PULSE = "/pulse",
  USER = "/user",
  FRIENDS = "/friends",
  AUTO_COLLECTS = "/autoCollects",
  GALLERY = "/gallery",
  TRACKED_USERS = "/trackedUsers",
  TPU = ""
}
