import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class SubRule {
  @Field()
  id: number
  @Field()
  type: string
  @Field()
  value: string
  @Field()
  operator: string
}

@ObjectType()
export class AutoCollectParentRule {
  @Field()
  id: number
  @Field(() => [SubRule])
  rules: SubRule[]
}
