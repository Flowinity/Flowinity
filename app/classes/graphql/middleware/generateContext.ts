import { Container } from "typedi"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Context } from "@app/types/graphql/context"
import { createContext } from "@app/lib/dataloader"
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
    if (process.env.NODE_ENV === "production") {
      throw new GqlError("NO_IP")
    } else {
      return "0.0.0.0"
    }
  }

  let ip =
    ctx.extra?.ip || ctx.req?.ip || ctx.req?.socket?.remoteAddress || "0.0.0.0"

  if (
    ip === "::1" ||
    ip === "::ffff:" ||
    ip === "::ffff:127.0.0.1" ||
    ip === "127.0.0.1" ||
    ip === "0.0.0.0"
  ) {
    // Depending on GraphQL WebSocket in v5, and normal HTTP v4, the object differs
    if (ctx?.req?.headers?.["x-real-ip"]) {
      ip = ctx.req.headers["x-real-ip"]
    } else if (ctx?.request?.headers?.["x-real-ip"]) {
      ip = ctx.request.headers["x-real-ip"]
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
        "unknown"
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
