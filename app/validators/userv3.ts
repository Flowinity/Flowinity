import { z } from "zod"

const Component: any = z.discriminatedUnion("name", [
  z.object({
    id: z.string().uuid(),
    name: z.literal("spacer"),
    props: z.object({
      height: z.number().max(40).min(0)
    })
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("parent"),
    props: z.object({
      children: z.lazy(() => z.array(Component))
    })
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("profile-info")
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("divider")
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("core-statistics"),
    props: z.object({
      friendsOnly: z.boolean()
    })
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("mutual-collections")
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("mutual-friends")
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("last-fm"),
    props: z.object({
      friendsOnly: z.boolean(),
      display: z.number(),
      type: z.string().optional()
    })
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("mal"),
    props: z.object({
      friendsOnly: z.boolean(),
      display: z.number(),
      type: z.string().optional()
    })
  }),
  z.object({
    id: z.string().uuid(),
    name: z.literal("social-links"),
    props: z.object({
      friendsOnly: z.boolean(),
      links: z
        .array(
          z.object({
            name: z.string().max(20).min(1),
            url: z.string().url(),
            color: z.string().length(7).regex(/^#/).nullable().optional()
          })
        )
        .max(10)
    })
  })
])

export const LayoutValidate = z.object({
  layout: z.object({
    columns: z
      .array(
        z.object({
          rows: z.array(Component).max(20)
        })
      )
      .max(1)
  }),
  config: z.object({
    containerMargin: z.union([z.null(), z.number()]).optional(),
    showStatsSidebar: z.boolean()
  }),
  version: z.number()
})

/*
const Component = z.switch((input) => input.name, {
  spacer: z.object({
    id: z.string().uuid(),
    name: z.literal("spacer"),
    props: z.object({
      height: z.number()
    })
  }),
  parent: z
    .object({
      id: z.string().uuid(),
      name: z.literal("parent"),
      props: z.object({
        children: z.array(Component)
      })
    })
    .optional(),
  "user-profile": z.object({
    id: z.string().uuid(),
    name: z.literal("user-profile")
  }),
  divider: z.object({
    id: z.string().uuid(),
    name: z.literal("divider")
  }),
  "core-statistics": z.object({
    id: z.string().uuid(),
    name: z.literal("core-statistics"),
    props: z.object({
      friendsOnly: z.number()
    })
  }),
  "mutual-collections": z.object({
    id: z.string().uuid(),
    name: z.literal("mutual-collections"),
    props: z.object({
      friendsOnly: z.number()
    })
  }),
  "mutual-friends": z.object({
    id: z.string().uuid(),
    name: z.literal("mutual-friends"),
    props: z.object({
      friendsOnly: z.number()
    })
  }),
  "last-fm": z.object({
    id: z.string().uuid(),
    name: z.literal("lastfm"),
    props: z.object({
      friendsOnly: z.boolean(),
      display: z.number(),
      type: z.string().optional()
    })
  }),
  mal: z.object({
    id: z.string().uuid(),
    name: z.literal("mal"),
    props: z.object({
      friendsOnly: z.boolean(),
      display: z.number(),
      type: z.string().optional()
    })
  })
})*/
