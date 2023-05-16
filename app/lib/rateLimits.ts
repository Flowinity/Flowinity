import rateLimit, { RateLimitRequestHandler } from "express-rate-limit"
import RedisStore from "rate-limit-redis"

// Import Miscellaneous
import redis from "../redis"

// Import Types
import { RequestAuth } from "@app/types/express"

const message: { errors: { name: string; message: string; status: number }[] } =
  {
    errors: [
      {
        name: "RATE_LIMITED",
        message: "Too many requests, please try again later.",
        status: 429
      }
    ]
  }

export const mailLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (status >= 400) towards rate limiting
  message,
  keyGenerator: (req: RequestAuth) => req.user?.id || req.ip, // Use the user ID if logged in, otherwise the IP address
  store: new RedisStore({
    //@ts-ignore
    sendCommand: (...args: string[]) => redis.sendCommand(args),
    prefix: "mailLimiter:"
  })
})

export const uploadLimiterUser: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (status >= 400) towards rate limiting
  message,
  keyGenerator: (req: RequestAuth) => req.user?.id || req.ip, // Use the user ID if logged in, otherwise the IP address
  store: new RedisStore({
    //@ts-ignore
    sendCommand: (...args: string[]) => redis.sendCommand(args),
    prefix: "uploadLimiterUser:"
  })
})

export const msgLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 8 * 1000,
  max: 8,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (status >= 400) towards rate limiting
  message,
  keyGenerator: (req: RequestAuth) => req.user?.id || req.ip, // Use the user ID if logged in, otherwise the IP address
  store: new RedisStore({
    //@ts-ignore
    sendCommand: (...args: string[]) => redis.sendCommand(args),
    prefix: "msgLimiter:"
  })
})

export const inviteLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (status >= 400) towards rate limiting
  message,
  keyGenerator: (req: RequestAuth) => req.user?.id || req.ip, // Use the user ID if logged in, otherwise the IP address
  store: new RedisStore({
    //@ts-ignore
    sendCommand: (...args: string[]) => redis.sendCommand(args),
    prefix: "inviteLimiter:"
  })
})

export const standardLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (status >= 400) towards rate limiting
  message,
  keyGenerator: (req: RequestAuth) => req.user?.id || req.ip, // Use the user ID if logged in, otherwise the IP address
  store: new RedisStore({
    //@ts-ignore
    sendCommand: (...args: string[]) => redis.sendCommand(args),
    prefix: "standardLimiter:"
  })
})

export const uploadLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 90 * 1000,
  max: 7,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (status >= 400) towards rate limiting
  message,
  keyGenerator: (req: RequestAuth) => req.user?.id || req.ip, // Use the user ID if logged in, otherwise the IP address
  store: new RedisStore({
    //@ts-ignore
    sendCommand: (...args: string[]) => redis.sendCommand(args),
    prefix: "uploadLimiter:"
  })
})

export default {
  mailLimiter,
  uploadLimiterUser,
  msgLimiter,
  inviteLimiter,
  standardLimiter,
  uploadLimiter
}
