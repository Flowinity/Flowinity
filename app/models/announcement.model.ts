import { BelongsTo, Column, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@Table
@ObjectType()
export class Announcement extends Model {
  @Field()
  @Column
  userId: number

  @Field()
  @Column
  content: string

  @Field({
    nullable: true
  })
  @Column
  type: string

  @Field()
  @BelongsTo(() => User, "userId")
  user: PartialUserBase
}
