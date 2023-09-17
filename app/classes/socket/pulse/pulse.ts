import { Field, InputType, ObjectType } from "type-graphql"
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
  @Field()
  id: string
  @Field()
  action: string
  @Field()
  route: string
  @Field()
  device: string
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
  @Field()
  timeSpent: number
}
