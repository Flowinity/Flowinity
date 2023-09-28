import { GraphQLResolveInfo } from "graphql/type"
import { Includeable } from "sequelize"
import { Badge } from "@app/models/badge.model"
import { Integration } from "@app/models/integration.model"
import { Theme } from "@app/models/theme.model"
import { Plan } from "@app/models/plan.model"
import { Domain } from "@app/models/domain.model"
import { Subscription } from "@app/models/subscription.model"
import { User } from "@app/models/user.model"

export default function dynamicFieldHelper(info: GraphQLResolveInfo) {
  const fields = info.fieldNodes[0].selectionSet?.selections.map(
    (selection: any) => selection.name.value
  )

  const attributes = fields?.filter((field) => field !== "__typename") || []
  let include: Includeable[] = []
  const knownIncludes = {
    user: User,
    subscription: Subscription,
    domain: Domain,
    plan: Plan,
    theme: Theme,
    integrations: Integration,
    badges: Badge
  } as Record<string, any>

  for (const field of attributes) {
    if (knownIncludes[field]) {
      include.push({
        model: knownIncludes[field],
        as: field
      })
    }
    const index = attributes.indexOf(field)
    if (index > -1) {
      attributes.splice(index, 1)
    }
  }
  console.log(attributes, include)
  return {
    attributes,
    include: include.length ? include : []
  }
}

export type DynamicFieldHelper = ReturnType<typeof dynamicFieldHelper>
