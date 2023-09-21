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
