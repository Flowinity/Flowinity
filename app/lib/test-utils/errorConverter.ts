import { expect } from "@jest/globals"

export function errorConverter(message?: string, code?: string) {
  if (!message && !code)
    throw new Error("You must provide either a message or a code")
  return {
    message: message ?? expect.any(String),
    locations: [
      {
        line: expect.any(Number),
        column: expect.any(Number)
      }
    ],
    path: [expect.any(String)],
    ...(code
      ? {
          extensions: {
            code
          }
        }
      : {})
  }
}
