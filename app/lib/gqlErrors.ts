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
    message:
      "Your account has been disabled. Please check your email and contact support if required."
  },
  EXPERIMENT_NOT_ALLOWED: {
    message: "You are not allowed to use this experimental feature."
  },
  CANNOT_ADD_OWNER: {
    message: "You cannot add the owner to the collection."
  },
  NOT_FRIENDS_WITH_USER_COLLECTION: {
    message: "You must be friends with the user to add them to your collection."
  },
  NOT_FRIENDS_WITH_USER_WORKSPACE: {
    message: "You must be friends with the user to add them to your workspace."
  },
  CANNOT_FRIEND_SELF: {
    message: "You cannot friend yourself."
  },
  SCOPE_NOT_FOUND: {
    message: "The requested scope could not be found."
  },
  INVALID_FRIEND_SELECTION: {
    message: "You must be friends with the user to add them."
  },
  INVALID_RESUMABLE_STATE_KEY: {
    message:
      "Invalid resumable state key on x-tpu-resumable-state. Must be a valid UUIDv4."
  },
  NO_IP: {
    message:
      "No valid IP address could be associated with the request.\n\nIf you are a user of PrivateUploader, please try again later.\n\nFor instance administrators: please ensure the reverse proxy is configured correctly."
  },
  OWNED_CHATS_ACCOUNT_DELETION: {
    message:
      "You cannot delete your account whilst owning chats. Please transfer them before trying again."
  },
  WORKSPACE_NOT_FOUND: {
    message: "The requested workspace could not be found."
  },
  FRIEND_REQUEST_ALREADY_SENT: {
    message: "You have already sent a friend request to this user."
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
