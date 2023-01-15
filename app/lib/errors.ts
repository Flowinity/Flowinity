let Errors = {
  UNKNOWN: {
    message: "An unknown error has occurred.",
    status: 500
  },
  NOT_FOUND: {
    message: "Route not implemented yet",
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
