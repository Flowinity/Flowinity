import rateLimit from "express-rate-limit"
import { RequestAuth } from "@app/types/express"

const message = {
  errors: [
    {
      name: "RATE_LIMITED",
      message: "Too many requests, please try again later.",
      status: 429
    }
  ]
}

const standardHeaders = {
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (status >= 400) towards rate limiting
  message,
  keyGenerator: (req: RequestAuth) => req.user?.id || req.ip // Use the user ID if logged in, otherwise the IP address
}

export const mailLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  ...standardHeaders
})

export const uploadLimiterUser = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  ...standardHeaders
})

export const msgLimiter = rateLimit({
  windowMs: 8 * 1000,
  max: 8,
  ...standardHeaders
})

export const inviteLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2,
  ...standardHeaders
})

export const standardLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  ...standardHeaders
})

export const uploadLimiter = rateLimit({
  windowMs: 90 * 1000,
  max: 7,
  ...standardHeaders
})

export default {
  mailLimiter,
  uploadLimiterUser,
  msgLimiter,
  inviteLimiter,
  standardLimiter,
  uploadLimiter
}
