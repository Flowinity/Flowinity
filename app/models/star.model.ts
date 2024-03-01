import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript"
import { Upload } from "@app/models/upload.model"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class Star extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  userId: number

  @Field()
  @Column
  attachmentId: number

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => Upload)
  @BelongsTo(() => Upload, "attachmentId")
  attachment: Upload
}
