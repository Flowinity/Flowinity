import { Field, ObjectType } from "type-graphql"
import { Column, DataType, Model, Table } from "sequelize-typescript"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class ChatBan extends Model {
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
  bannedUserId: number

  @Field(() => Number)
  @Column
  chatId: number

  @Field()
  @Column
  ipBanned: boolean

  @Field(() => String, {
    nullable: true
  })
  @Column
  reason: string

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date
}
