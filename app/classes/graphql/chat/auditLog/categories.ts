import { registerEnumType } from "type-graphql"

export enum AuditLogCategory {
  "USER" = "USER",
  "RANK" = "RANK",
  "MESSAGE" = "MESSAGE",
  "INVITE" = "INVITE",
  "PIN_MESSAGE" = "PIN_MESSAGE",
  "BOT" = "BOT",
  "SETTINGS" = "SETTINGS",
  "EMOJI" = "EMOJI"
}

export enum AuditLogActionType {
  "MODIFY" = "MODIFY",
  "ADD" = "ADD",
  "REMOVE" = "REMOVE"
}

registerEnumType(AuditLogCategory, {
  name: "AuditLogCategory",
  description: "Used for chat audit log."
})

registerEnumType(AuditLogActionType, {
  name: "AuditLogActionType",
  description:
    "Used for chat audit log to determine what type of action was performed."
})
