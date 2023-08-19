import { AuthChecker, AuthCheckerInterface, ResolverData } from "type-graphql"
import { Context } from "@app/types/graphql/context"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { checkScope } from "@app/lib/auth"
import { GraphQLError } from "graphql/error"

export const authChecker: AuthChecker<Context> = (
  { root, args, context, info }: ResolverData<Context>,
  requiredScope: string[] | string,
  userOptional: boolean = false,
  accessLevel: AccessLevel = AccessLevel.USER
) => {
  const user = context.user
  if (!user && !userOptional) {
    throw new GraphQLError(
      `You need to be logged in to do this (Authorization header is empty or invalid).`
    )
  }
  const scopes = context.scopes
  if (!checkScope(requiredScope, scopes)) {
    if (!userOptional) {
      throw new GraphQLError(
        `You need to be logged in to do this (Authorization header is empty or invalid).`
      )
    }
    context.user = null
    return true
  }
  return true
}
