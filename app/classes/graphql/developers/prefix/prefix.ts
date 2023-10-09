import { Field, InputType, Int, ObjectType } from "type-graphql"

@ObjectType()
export class Prefix {
  @Field()
  prefix: string
  @Field(() => [LookupPrefix])
  commands: LookupPrefix[]
}

@ObjectType()
export class Command {
  @Field()
  command: string
  @Field()
  description: string
}

@ObjectType()
export class LookupPrefix {
  @Field()
  command: string
  @Field()
  description: string
  @Field()
  botId: number
}

@InputType()
export class LookupPrefixInput {
  @Field(() => Int)
  chatAssociationId: number
  @Field()
  prefix: string
}
