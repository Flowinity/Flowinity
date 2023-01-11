let Errors = {
  UNKNOWN: {
    message: "Unknown error",
    status: 500
  },
  NOT_FOUND: {
    message: "Route not implemented yet",
    status: 404
  },
  USER_NOT_FOUND: {
    message: "User not found",
    status: 404
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
