import {
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Field, Int, ObjectType } from "type-graphql"
import { AutoCollectParentRule } from "@app/classes/graphql/autoCollects/rules"

@ObjectType()
@Table
export class AutoCollectRule extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  name: string

  @Field()
  @Default(true)
  @Column
  enabled: boolean

  @Field()
  @Column
  collectionId: number

  @Field()
  @Default(true)
  @Column
  requireApproval: boolean

  @Field(() => [AutoCollectParentRule])
  @Default([])
  @Column({
    type: DataType.JSON
  })
  rules: object

  @Column
  userId: number

  @BelongsTo(() => User, "userId")
  user: User

  @BelongsTo(() => Collection, "collectionId")
  collection: User
}
