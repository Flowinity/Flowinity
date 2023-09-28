import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class BadgeAssociation extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  badgeId: number

  @Field()
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId: number

  @Field()
  @Column({
    type: DataType.DATE
  })
  expiredAt: Date

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  hidden: boolean

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User
}
