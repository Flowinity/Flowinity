import { Container } from "typedi"
import { UserResolver } from "@app/controllers/graphql/user.resolver"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Context } from "@app/types/graphql/context"
import { createContext } from "dataloader-sequelize"

export default async function generateContext(ctx: any): Promise<Context> {
  let token
  let session

  token =
    ctx?.request?.headers?.get("Authorization") ||
    ctx?.connectionParams?.Authorization ||
    ctx?.connectionParams?.token ||
    ""

  if (global.config?.finishedSetup) {
    const userResolver = Container.get(UserResolver)
    session = await userResolver.findByToken(token)
  }

  return {
    user: session?.user,
    client: {
      version:
        ctx?.request?.headers?.get("X-TPU-Client-Version") ||
        ctx?.connectionParams?.clientVersion ||
        "unknown",
      name:
        ctx?.request?.headers?.get("X-TPU-Client") ||
        ctx?.connectionParams?.clientName ||
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
    ip: ctx.req?.ip || "0.0.0.0",
    meta: {},
    request: ctx.request,
    req: ctx.req,
    cache: global.gqlCache
  } as Context
}
