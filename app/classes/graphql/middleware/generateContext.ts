import { Container } from "typedi"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Context } from "@app/types/graphql/context"
import { createContext } from "dataloader-sequelize"
import { GqlError } from "@app/lib/gqlErrors"

export default async function generateContext(ctx: any): Promise<Context> {
  let token
  let session

  token =
    ctx?.request?.headers?.get("Authorization") ||
    ctx?.connectionParams?.authorization ||
    ctx?.connectionParams?.token ||
    ""

  if (global.config?.finishedSetup) {
    const userResolver = Container.get(UserResolver)
    session = await redis.json.get(`session:${token}`)
    const user = await redis.json.get(`user:${session?.userId || 0}`)
    if (session && user) {
      session.user = user
    } else {
      session = await userResolver.findByToken(token)
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

        redis.json.set(`user:${session.userId}`, "$", session.user)
      }
    }
  }

  function error() {
    if (process.env.NODE_ENV !== "production") {
      return "0.0.0.0"
    }
    throw new GqlError("NO_IP")
  }

  let ip =
    ctx.extra?.ip || ctx.req?.ip || ctx.req?.socket?.remoteAddress || "0.0.0.0"

  const realIPHeader = "x-forwarded-for"

  if (
    ip === "::1" ||
    ip === "::ffff:" ||
    ip === "::ffff:127.0.0.1" ||
    ip === "127.0.0.1" ||
    ip === "0.0.0.0" ||
    ip === "::ffff:192.168.0.60"
  ) {
    // Depending on GraphQL WebSocket in v5, and normal HTTP v4, the object differs
    if (ctx?.req?.ip) {
      ip = ctx.req.ip
    } else if (ctx?.extra?.request?.headers?.[realIPHeader]) {
      ip = ctx.extra.request.headers[realIPHeader]
    } else if (ctx?.req?.headers?.[realIPHeader]) {
      ip = ctx.req.headers[realIPHeader]
    } else if (ctx?.request?.headers?.[realIPHeader]) {
      ip = ctx.request.headers[realIPHeader]
    } else {
      ip = error()
    }
  }

  return {
    user: session?.user,
    client: {
      version:
        ctx?.request?.headers?.get("X-TPU-Client-Version") ||
        ctx?.connectionParams?.["x-tpu-client-version"] ||
        "unknown",
      name:
        ctx?.request?.headers?.get("X-TPU-Client") ||
        ctx?.connectionParams?.["x-tpu-client"] ||
        "unknown",
      userAgent:
        ctx?.request?.headers?.get("User-Agent") ||
        ctx?.connectionParams?.["user-agent"],
      majorVersion: parseInt(
        ctx?.request?.headers?.get("X-TPU-Client-Version")?.split(".")[0] ||
          ctx?.connectionParams?.["x-tpu-client-version"]?.split(".")[0] ||
          "4"
      )
    },
    scopes: session?.scopes || "",
    role: session
      ? session?.user?.administrator
        ? AccessLevel.ADMIN
        : session?.user?.moderator
          ? AccessLevel.MODERATOR
          : AccessLevel.USER
      : AccessLevel.NO_ACCESS,
    token,
    dataloader: global.config?.finishedSetup ? createContext(db) : null,
    ip,
    meta: {},
    request: ctx.request,
    req: ctx.req,
    cache: global.gqlCache,
    id: ctx.id
  } as Context
}
