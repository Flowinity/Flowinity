import { Field, InputType, Int, ObjectType } from "type-graphql"

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

@InputType()
export class AutoCollectRuleQueryInput {
  @Field(() => Int)
  id: number
}
