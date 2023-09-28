import { Field, ObjectType } from "type-graphql"
import { Column, DataType, Model, Table } from "sequelize-typescript"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class ChatEmoji extends Model {
  @Field(() => String)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Field(() => Number)
  @Column
  userId: number

  @Field(() => Number)
  @Column
  chatId: number

  @Field({
    nullable: true
  })
  @Column
  icon: string

  @Field({
    nullable: true
  })
  @Column
  name: string

  @Field()
  @Column
  deleted: boolean

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date
}
