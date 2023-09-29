import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Plan } from "@app/models/plan.model"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Badge extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string

  @Field({
    nullable: true
  })
  @Column
  description: string

  @Field({
    nullable: true
  })
  @Column
  tooltip: string

  @Field({
    nullable: true
  })
  @Column
  image: string

  @Field({
    nullable: true
  })
  @Column
  icon: string

  @Field({
    nullable: true
  })
  @Column
  color: string

  @Field()
  @Column
  unlocked: boolean

  @Field({
    nullable: true
  })
  @Column
  priority: number

  @Field(() => Plan)
  @BelongsTo(() => Plan, "planId")
  plan: Plan

  @Field(() => [PartialUserBase])
  @BelongsToMany(() => User, () => BadgeAssociation, "badgeId", "userId")
  users: User[]
}
