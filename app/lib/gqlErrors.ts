import { GraphQLError } from "graphql/error"

const Errors = {
  INVALID_CREDENTIALS: {
    message: "The username or password you entered was incorrect."
  },
  SSO_ENFORCED: {
    message:
      "You are using legacy Flowinity SSO, you must reset your password to login."
  },
  INVALID_TOTP: {
    message: "Your 2FA code is invalid."
  },
  USERNAME_TAKEN: {
    message: "The desired username has already been taken."
  },
  GROUP_OWNER_CANNOT_LEAVE: {
    message:
      "You must first transfer ownership of the group before you can leave."
  },
  UNKNOWN: {
    message: "Something went wrong."
  },
  UNSUPPORTED_OPERATION: {
    message: "Unsupported operation."
  },
  USER_NOT_FOUND: {
    message: "User not found."
  },
  RESTRICTED_MESSAGING: {
    message: "You cannot send messages to this user."
  },
  BLOCKED: {
    message: "You have been blocked by this user."
  },
  RANK_NOT_FOUND: {
    message: "Rank not found."
  },
  RANK_TOO_HIGH: {
    message:
      "You don't have permission to update this rank as it's higher, or at the same level as your current rank."
  },
  INVALID_INVITE: {
    message: "The invite is invalid or has expired."
  },
  COLUBRINA_CHAT: {
    message: "This chat needs to be migrated from Colubrina to Communications."
  },
  ALREADY_IN_CHAT: {
    message: "You're already in the chat!"
  },
  NOT_ADMIN: {
    message: "You need to be an administrator to do this."
  },
  INVALID_EMOJI: {
    message: "Invalid emoji."
  },
  ILLEGAL_EMOJI_CHARACTER: {
    message: "Your emoji name cannot include ~"
  },
  APP_NOT_FOUND: {
    message: "The app could not be found."
  },
  APP_USER_NOT_FOUND: {
    message: "The app user could not be found."
  },
  PRIVATE_APP: {
    message:
      "This app is private and you need to be added by the owner or manager."
  },
  BLOCK_SELF: {
    message: "You can't block yourself."
  },
  NOT_BOT: {
    message: "You need to be a bot to do this."
  },
  FRIEND_REQUESTS_DISABLED: {
    message: "This user does not allow you to send friend requests to them."
  },
  INVALID_SCOPE: {
    message:
      "Please ensure you have the correct API scope permissions to view this."
  },
  INVITE_BOT: {
    message:
      "You cannot join groups directly as a bot user, you must be added explicitly by a group administrator."
  },
  COLLECTION_NOT_FOUND: {
    message:
      "The requested collection could not be found or you don't have permission to access it."
  },
  ATTACHMENT_NOT_FOUND: {
    message: "The requested upload(s) couldn't be found."
  },
  USER_BANNED: {
    message: "Your account has been disabled. Please contact support."
  }
}

type ErrorKey = keyof typeof Errors

export class GqlError extends GraphQLError {
  constructor(errorKey: ErrorKey) {
    if (Errors[errorKey]) {
      const error = Errors[errorKey]
      super(
        error.message,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          code: errorKey
        }
      )
    } else {
      throw new Error(`Unknown error key: ${errorKey}`)
    }
  }
}
