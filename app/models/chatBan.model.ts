import { Field, Int, ObjectType } from "type-graphql"
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

  @Field(() => Int, {
    nullable: true
  })
  @Column
  userId: number

  @Field(() => Int)
  @Column
  bannedUserId: number

  @Field(() => Int)
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
