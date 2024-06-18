import { ResolverData, UseMiddleware } from "type-graphql"
import { Context } from "@app/types/graphql/context"

export class RateLimitArgs {
  window?: number
  max?: number
  limitByVariables?: boolean
  errorMessage?: string
}

export default function RateLimit({
  window = 60,
  max = 10,
  limitByVariables = false,
  errorMessage = "Too many requests, please try again later."
}: RateLimitArgs) {
  return UseMiddleware(
    async (
      { info: { variableValues, fieldName }, context }: ResolverData<Context>,
      next
    ) => {
      if (!redis) return next()
      const visitorKey = context.user
        ? "user:" + context.user.id
        : "ip:" + context.ip
      const variableKey =
        limitByVariables &&
        JSON.stringify(variableValues)
          .replace(/[^a-zA-Z0-9,]/g, "")
          .trim()
      const key: string = ["limit", visitorKey, fieldName, variableKey].join(
        ":"
      )
      const oldRecord = await redis.get(key)
      if (oldRecord) {
        if (parseInt(oldRecord) > max) {
          throw new Error(errorMessage)
        } else {
          await redis.multi().incr(key).expire(key, window).exec()
        }
      } else {
        await redis.multi().set(key, 1, "EX", window).expire(key, window).exec()
      }
      return next()
    }
  )
}
