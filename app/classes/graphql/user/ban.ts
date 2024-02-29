import { registerEnumType } from "type-graphql"

export enum BanReason {
  OTHER = "OTHER",
  PENDING_MANUAL_ACCOUNT_DELETION = "PENDING_MANUAL_ACCOUNT_DELETION",
  ILLEGAL_CONTENT = "ILLEGAL_CONTENT",
  SPAM = "SPAM",
  HARASSMENT = "HARASSMENT",
  UNDER_AGE = "UNDER_AGE"
}

registerEnumType(BanReason, {
  name: "BanReason",
  description: "Reasons for banning a user."
})
