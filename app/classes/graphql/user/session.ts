import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class SessionInfo {
  @Field(() => [AccessedFrom])
  accessedFrom: AccessedFrom[]
}

@ObjectType()
export class AccessedFrom {
  @Field()
  ip: string
  @Field({
    nullable: true
  })
  userAgent?: string
  @Field({
    nullable: true
  })
  isp?: string
  @Field({
    nullable: true
  })
  location?: string
  @Field()
  date: string
  @Field({
    nullable: true
  })
  asn?: number
}
