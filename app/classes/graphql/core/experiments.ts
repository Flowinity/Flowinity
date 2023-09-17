import { Field, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
export class ExperimentType {
  @Field()
  id: string
  @Field(() => Number)
  value: boolean | number
  @Field({
    nullable: true
  })
  description: string
  @Field(() => DateType, {
    nullable: true
  })
  createdAt: Date
  @Field({
    nullable: true
  })
  refresh?: boolean
}
