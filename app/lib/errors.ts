let Errors = {
  UNKNOWN: {
    message: "An unknown error has occurred.",
    status: 500
  },
  NOT_FOUND: {
    message: "Route not implemented yet.",
    status: 404
  },
  USER_NOT_FOUND: {
    message: "User not found",
    status: 404
  },
  FILE_EXPECTED: {
    message: "A file was expected but was not present.",
    status: 400
  },
  INVALID_CREDENTIALS: {
    message: "Your username or password was incorrect.",
    status: 401
  },
  INVALID_TOTP: {
    message: "Your TOTP/2FA code was incorrect.",
    status: 401
  },
  COLLECTION_NOT_FOUND: {
    message: "The requested collection could not be found.",
    status: 404
  },
  PLACEHOLDER: {
    message: "This is a placeholder error.",
    status: 500
  },
  ADMIN_ONLY: {
    message: "You must be an administrator to access this resource.",
    status: 403
  },
  SSO_ENFORCED: {
    message:
      "You are using a legacy auth method, please reset your password on TPUv1 to continue.",
    status: 401
  },
  NO_SCOPES_PROVIDED: {
    message: "No scopes were provided.",
    status: 400
  },
  INVALID_SCOPES_PROVIDED: {
    message: "Invalid scopes were provided.",
    status: 400
  },
  COLLECTION_NO_PERMISSION: {
    message: "You do not have permission to modify this collection.",
    status: 403
  },
  COLLECTION_ITEM_NOT_FOUND: {
    message: "The requested item could not be found in this collection.",
    status: 404
  },
  COLLECTION_USER_NOT_FOUND: {
    message: "The requested user could not be found in this collection.",
    status: 404
  },
  INVALID_PARAMETERS: {
    message: "Invalid parameters were provided.",
    status: 400
  },
  SLIDESHOW_NOT_FOUND: {
    message: "The requested slideshow could not be found.",
    status: 404
  },
  INVITE_NOT_FOUND: {
    message: "The requested invite could not be found.",
    status: 404
  },
  INVITE_ALREADY_USED: {
    message: "The requested invite has already been used.",
    status: 400
  },
  PASSWORD_TOO_SHORT: {
    message: "Your password must be at least 8 characters long.",
    status: 400
  },
  API_REMOVED: {
    message:
      "TroploPrivateUploader API version 1 is no longer available from 2023-01-26, please check the relevant API documentation for v2 at /api/docs.",
    status: 410
  },
  INVALID_EMAIL: {
    message:
      "The provided email address is invalid (Please use your email, not username!).",
    status: 400
  },
  INVALID_PASSWORD_RESET_CODE: {
    message: "The provided password reset code has expired or is invalid.",
    status: 400
  },
  CANNOT_FRIEND_SELF: {
    message:
      "You can't be friends with yourself, should Jitsi with real people instead.",
    status: 400
  },
  NOT_FRIENDS_WITH_USER_COLLECTION: {
    message:
      "You must be friends with the user you are trying to add to the collection.",
    status: 400
  },
  TOO_MANY_ITEMS_DELETE: {
    message: "You cannot bulk delete more than 24 items.",
    status: 400
  },
  CANNOT_ADD_OWNER: {
    message: "You cannot add the owner to a collection.",
    status: 400
  },
  NO_FILE: {
    message: "No file was provided.",
    status: 400
  },
  ATTACHMENT_NOT_FOUND: {
    message: "The requested attachment could not be found.",
    status: 404
  },
  ATTACHMENT_NOT_FOUND_ROUTE: {
    message: "The requested attachment could not be found.",
    status: 400
  },
  TOO_MANY_ALTERNATE_PASSWORDS: {
    message:
      "You cannot have more than 10 alternate passwords associated with your account.",
    status: 400
  },
  ALTERNATE_PASSWORD_NAME_NOT_UNIQUE: {
    message: "The provided alternate password name is not unique.",
    status: 400
  },
  INVALID_ALTERNATE_PASSWORD: {
    message: "The provided alternate password is invalid.",
    status: 400
  },
  NAME_FIELD: {
    message: "The provided name is invalid.",
    status: 400
  },
  WORKSPACE_USER_NOT_FOUND: {
    message: "The requested user could not be found in this workspace.",
    status: 404
  },
  WORKSPACE_NO_PERMISSION: {
    message: "You do not have permission to modify this workspace.",
    status: 403
  },
  WORKSPACE_NOT_FOUND: {
    message: "The requested workspace could not be found.",
    status: 404
  },
  COMING_SOON: {
    message: "This feature is coming soon!",
    status: 400
  },
  CHAT_NOT_FOUND: {
    message:
      "The requested chat could not be found or you are not a part of it.",
    status: 400
  },
  INVALID_FRIEND_SELECTION: {
    message: "You are attempting to add a user that is not your friend.",
    status: 400
  },
  MESSAGE_NOT_FOUND: {
    message: "The requested message could not be found.",
    status: 400
  },
  EXPERIMENT_NOT_ALLOWED: {
    message: "You are not allowed to use this experimental feature.",
    status: 400
  },
  REPLY_MESSAGE_NOT_FOUND: {
    message: "The requested message to reply to could not be found.",
    status: 400
  },
  MEDIAPROXY_INVALID_TOKEN: {
    message: "The provided MediaProxy URL is invalid.",
    status: 400
  },
  RATE_LIMITED: {
    message: "You are being rate limited.",
    status: 429
  },
  NO_MESSAGE_CONTENT: {
    message: "You must provide message content.",
    status: 400
  },
  USER_ALREADY_IN_CHAT: {
    message: "The user is already in the chat.",
    status: 400
  },
  CHAT_INSUFFICIENT_PERMISSIONS: {
    message: "You do not have permission to modify this chat.",
    status: 403
  },
  CHAT_USER_NOT_FOUND: {
    message: "The requested user could not be found in this chat.",
    status: 400
  },
  INVALID_SEARCH: {
    message: "The provided search is invalid.",
    status: 400
  }
}

function processErrors(errorName: string) {
  let arr = Errors[errorName]

  return {
    name: errorName,
    message: arr[0],
    status: arr[1]
  }
}

let ProcessedErrors = {
  VALIDATION_ERROR: "",
  invalidParameter: function (param: string, message: string) {
    let punctuatedMessage = ""
    if (message) {
      punctuatedMessage = ": " + message
    }

    return {
      name: "invalidParameter",
      message: `${param} is invalid${punctuatedMessage}`,
      status: 400,
      parameter: param
    }
  },
  customError: function (message: string, status: number) {
    return {
      name: "customError",
      message: message,
      status: status,
      parameter: message
    }
  },
  sequelizeValidation: function (sequelize: any, obj: ErrorObject) {
    return new sequelize.ValidationError(obj.error, [
      new sequelize.ValidationErrorItem(
        obj.error,
        "Validation error",
        obj.path,
        obj.value
      )
    ])
  }
}

for (let errorName in Errors) {
  ProcessedErrors[errorName] = processErrors(errorName)
}

ProcessedErrors.VALIDATION_ERROR = "VALIDATION_ERROR"

export default Errors
