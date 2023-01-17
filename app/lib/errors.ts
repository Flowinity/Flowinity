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
    message: "You are using a legacy auth method, please reset your password on TPUv1 to continue.",
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
      new sequelize.ValidationErrorItem(obj.error, "Validation error", obj.path, obj.value)
    ])
  }
}

for (let errorName in Errors) {
  ProcessedErrors[errorName] = processErrors(errorName)
}

ProcessedErrors.VALIDATION_ERROR = "VALIDATION_ERROR"

export default Errors
