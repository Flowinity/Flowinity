import { Field, Int, ObjectType } from "type-graphql"
import { Column, DataType, Model, Table } from "sequelize-typescript"
import { DateType } from "@app/classes/graphql/serializers/date"
import { AuditLogActionType, AuditLogCategory } from "@app/classes/graphql/chat/auditLog/categories"

@ObjectType()
@Table
export class ChatAuditLog extends Model {
  @Field(() => String)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Field(() => Int)
  @Column
  userId: number

  @Field(() => Int)
  @Column
  chatId: number

  @Field(() => AuditLogCategory)
  @Column({
    type: DataType.ENUM(
      "USER",
      "RANK",
      "MESSAGE",
      "INVITE",
      "PIN_MESSAGE",
      "BOT",
      "SETTINGS",
      "EMOJI"
    )
  })
  category: AuditLogCategory

  @Field(() => AuditLogActionType)
  @Column({
    type: DataType.ENUM("ADD", "REMOVE", "MODIFY")
  })
  actionType: AuditLogActionType

  @Field(() => String)
  @Column
  message: string

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date
}
