import { Field, InputType, ObjectType, registerEnumType } from "type-graphql"
import { GraphQLJSON } from "graphql-scalars"
import { v4 as uuidv4 } from "uuid"

export enum HomeWidgetType {
  SITE_STATS = "SITE_STATS",
  RECENT_NOTES = "RECENT_NOTES",
  RECENT_COLLECTIONS = "RECENT_COLLECTIONS",
  RECENT_UPLOADS = "RECENT_UPLOADS",
  RECENT_CHATS = "RECENT_CHATS",
  AT_A_GLANCE = "AT_A_GLANCE",
  SITE_STATS_GRAPH = "SITE_STATS_GRAPH",
  USER_STATS_GRAPH = "USER_STATS_GRAPH",
  USER_STATS = "USER_STATS",
  ANNOUNCEMENTS = "ANNOUNCEMENTS"
}

registerEnumType(HomeWidgetType, {
  name: "HomeWidgetType",
  description: "The type of home widget"
})

@ObjectType("HomeWidget")
@InputType("HomeWidgetInput")
export class HomeWidget {
  @Field(() => HomeWidgetType)
  type: HomeWidgetType
  @Field(() => GraphQLJSON, {
    nullable: true
  })
  props: Record<string, any> | null
  @Field(() => String, {
    description: "In UUID format."
  })
  id: string
}

@ObjectType()
@InputType("HomeColumnInput")
export class HomeRow {
  @Field(() => [HomeWidget])
  widgets: HomeWidget[]
  @Field(() => String, {
    description: "In UUID format."
  })
  id: string
}

@ObjectType()
@InputType("HomeWidgetsInput")
export class HomeWidgets {
  @Field(() => [HomeRow])
  rows: HomeRow[]
  @Field(() => Boolean, {
    nullable: true
  })
  default: boolean
}

export const defaultHomeWidgets: HomeWidgets = {
  rows: [
    {
      id: uuidv4(),
      widgets: [
        {
          id: uuidv4(),
          type: HomeWidgetType.AT_A_GLANCE,
          props: null
        },
        {
          id: uuidv4(),
          type: HomeWidgetType.SITE_STATS,
          props: null
        }
      ]
    },
    {
      id: uuidv4(),
      widgets: [
        {
          id: uuidv4(),
          type: HomeWidgetType.ANNOUNCEMENTS,
          props: null
        },
        {
          id: uuidv4(),
          type: HomeWidgetType.SITE_STATS_GRAPH,
          props: null
        }
      ]
    }
  ],
  default: true
}
