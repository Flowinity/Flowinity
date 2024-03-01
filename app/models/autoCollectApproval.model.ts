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
import { Upload } from "@app/models/upload.model"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class AutoCollectApproval extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field(() => Int)
  @Column
  autoCollectRuleId: number

  @Field()
  @Column
  uploadId: number

  @Field(() => Int)
  @Column
  collectionId: number

  @Field(() => Int, {
    nullable: true
  })
  @Column
  userId: number

  @Field()
  @Column
  approved: boolean

  // TODO: GraphQL type
  @Default([])
  @Column({
    type: DataType.JSON
  })
  info: boolean

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => Collection, {
    nullable: true
  })
  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @Field(() => AutoCollectRule, {
    nullable: true
  })
  @BelongsTo(() => AutoCollectRule, "autoCollectRuleId")
  autoCollectRule: AutoCollectRule

  @Field(() => Upload, {
    nullable: true
  })
  @BelongsTo(() => Upload, "uploadId")
  attachment: Upload
}
