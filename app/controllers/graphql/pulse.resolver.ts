import { Arg, Ctx, Mutation, Resolver } from "type-graphql"
import { Service } from "typedi"
import { Pulse } from "@app/models/pulse.model"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import RateLimit from "@app/lib/graphql/RateLimit"
import {
  Pulse as PulseClass,
  PulseUpdate,
  SinglePulse
} from "@app/classes/socket/pulse/pulse"
import { Context } from "@app/types/graphql/context"

@Resolver(Pulse)
@Service()
export class PulseResolver {
  @Authorization({
    scopes: [],
    userOptional: true
  })
  @RateLimit({
    max: 50,
    window: 10
  })
  @Mutation(() => String)
  async createPulse(@Arg("input") input: PulseClass, @Ctx() ctx: Context) {
    if (!ctx.user?.pulse) return ""

    try {
      if (input.type === "gallery") {
        const pulse = await Pulse.create({
          userId: ctx.user.id,
          action: "focus",
          route: "/gallery",
          timeSpent: 0,
          device: input.device,
          sysInfo: input.sysInfo,
          name: input.name,
          other: input.other
        })

        return pulse.id
      } else if (input.type === "global") {
        const pulse = await Pulse.create({
          userId: ctx.user.id,
          action: "focus",
          route: input.route,
          timeSpent: 0,
          device: input.device,
          sysInfo: input.sysInfo,
          name: input.name,
          other: input.other
        })

        return pulse.id
      } else {
        return ""
      }
    } catch (err) {
      console.error(err)
      console.error("Error creating pulse.")
      return ""
    }
  }

  @Authorization({
    scopes: [],
    userOptional: true
  })
  @RateLimit({
    max: 50,
    window: 10
  })
  @Mutation(() => String)
  async createSinglePulse(
    @Arg("input") input: SinglePulse,
    @Ctx() ctx: Context
  ) {
    if (!ctx.user?.pulse) return ""

    try {
      if (input.timeSpent > 3600000) return
      const pulse = await Pulse.create({
        userId: ctx.user.id,
        action: input.action,
        route: input.route,
        timeSpent: input.timeSpent || 0,
        device: input.device,
        sysInfo: input.sysInfo,
        name: input.name,
        other: input.other
      })
      return pulse.id
    } catch {
      console.log("error creating pulse")
      return ""
    }
  }

  @Authorization({
    scopes: [],
    userOptional: true
  })
  @RateLimit({
    max: 50,
    window: 10
  })
  @Mutation(() => String)
  async updatePulse(@Arg("input") input: PulseUpdate, @Ctx() ctx: Context) {
    if (!ctx.user?.pulse) return ""

    const pulse = await Pulse.findOne({
      where: {
        id: input.id,
        userId: ctx.user.id
      }
    })

    if (pulse) {
      if (input.timeSpent < pulse.timeSpent) return
      if (input.timeSpent - pulse.timeSpent > 600000) return

      await pulse.update({
        timeSpent: input.timeSpent
      })
      return pulse.id
    } else {
      return ""
    }
  }
}
