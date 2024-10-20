import { Field, Float, InputType, ObjectType } from "type-graphql"
import { GraphQLJSON } from "graphql-scalars"

@ObjectType()
@InputType("PulseUserAgent")
export class PulseSysInfo {
  @Field()
  ua: string
}
@InputType("PulseInput")
@ObjectType()
export class Pulse {
  @Field()
  type: string
  @Field({
    nullable: true
  })
  id: string
  @Field()
  action: string
  @Field()
  route: string
  @Field()
  device: string
  @Field(() => PulseSysInfo)
  sysInfo: PulseSysInfo
  @Field(() => String, {
    nullable: true
  })
  name: string | null
  @Field(() => GraphQLJSON, {
    nullable: true
  })
  other: Record<string, any>
}

@InputType("SinglePulseInput")
@ObjectType()
export class SinglePulse extends Pulse {
  @Field(() => Float)
  timeSpent: number
}

@InputType("PulseUpdateInput")
@ObjectType()
export class PulseUpdate {
  @Field()
  id: string
  @Field(() => Float)
  timeSpent: number
}
