import { Field, InputType } from "type-graphql"

@InputType()
export class NoteInput {
  @Field({
    nullable: true
  })
  id: number
  @Field({
    nullable: true
  })
  shareLink: string
}
