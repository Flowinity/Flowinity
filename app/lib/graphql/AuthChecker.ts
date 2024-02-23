import { AuthChecker, Authorized, ResolverData } from "type-graphql"
import { Context } from "@app/types/graphql/context"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { checkScope, Scope, updateSession } from "@app/lib/auth"
import { GraphQLError } from "graphql/error"
import { Container } from "typedi"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { Session } from "@app/models/session.model"
import { PartialUserAuth } from "@app/classes/graphql/user/partialUser"

export interface AuthCheckerOptions {
  scopes: Scope[] | Scope
  userOptional?: boolean
  accessLevel?: AccessLevel
  emailOptional?: boolean
}

export const Authorization = (options: AuthCheckerOptions) =>
  Authorized(options)

export type CacheSession =
  | {
      expiredAt: null
      oauthAppId: string
      fake: boolean
      scopes: string
      type: string
      userId: number
      user: PartialUserAuth
      token: string | null
    }
  | (Session & { user: PartialUserAuth })
  | null

export const authChecker: AuthChecker<Context> = async (
  { context }: ResolverData<Context>,
  options: any[]
) => {
  const token = context.token
  let cache
  if (config.finishedSetup) {
    cache = await redis.json.get(`session:${token}`)
  }
  let user: PartialUserAuth | null = null
  let session: CacheSession = null
  if (!cache) {
    if (global.config.finishedSetup) {
      const userResolver = Container.get(UserResolver)
      session = await userResolver.findByToken(token)
      user = !session?.user?.banned ? session?.user || null : null
      if (session) {
        redis.json.set(
          `session:${token}`,
          "$",
          {
            ...("toJSON" in session ? session.toJSON() : session),
            user: undefined
          },
          {
            ttl: session?.expiredAt
              ? dayjs(session.expiredAt).diff(dayjs(), "second")
              : 60 * 60 * 24 * 7
          }
        )
        redis.json.set(`user:${session?.userId}`, "$", session?.user)
      }
    } else {
      user = null
    }
  } else {
    session = cache
    const userCache = await redis.json.get(`user:${session!.userId}`)
    if (userCache) {
      if (!userCache.banned) user = userCache
    } else {
      const userResolver = Container.get(UserResolver)
      session = await userResolver.findByToken(token)
      user = !session?.user?.banned ? session?.user || null : null
      redis.json.set(`user:${session?.userId}`, "$", user)
    }
  }
  const opts = options[0] as AuthCheckerOptions
  context.user = user
  if (!user && !opts.userOptional) {
    throw new GraphQLError(
      `You need to be logged in to do this (Authorization header is empty or invalid).`,
      {
        extensions: {
          code: "UNAUTHORIZED"
        }
      }
    )
  }

  if (session && !("fake" in session))
    updateSession(session, context.ip).then(() => {})
  const scopeNormalized =
    typeof opts.scopes === "string" ? [opts.scopes] : opts.scopes

  if (
    !opts.emailOptional &&
    user &&
    !user.emailVerified &&
    !scopeNormalized?.some(
      (item) =>
        item.includes("user.view") ||
        item.includes("chats.view") ||
        item.includes("workspaces.view") ||
        item.includes("collections.view") ||
        item.includes("")
    ) &&
    config.email.enabled
  ) {
    throw new GraphQLError("Please verify your email address first!", {
      extensions: {
        code: "UNVERIFIED_EMAIL"
      }
    })
  }

  if (
    (opts.accessLevel === AccessLevel.ADMIN && !user?.administrator) ||
    (opts.accessLevel === AccessLevel.MODERATOR &&
      (!user?.administrator || !user?.moderator))
  )
    throw new GraphQLError(
      "You need to be a TPU Instance Administrator to perform this action.",
      {
        extensions: {
          code: "NOT_ADMIN"
        }
      }
    )

  const scopes = context.scopes
  if (!opts.scopes)
    throw new GraphQLError(
      "Please check code! Auth checker options object is not valid!"
    )
  if (!checkScope(opts.scopes, scopes)) {
    if (!opts.userOptional) {
      throw new GraphQLError(
        `Invalid scopes for API key (scope required: ${opts.scopes}, scopes granted: ${scopes}).`,
        {
          extensions: {
            code: "SCOPE_REQUIRED"
          }
        }
      )
    }
    context.user = null
    return true
  }
  return true
}
