import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  Table,
  Unique
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class CollectionUser extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  collectionId: number

  @Field()
  @Default(true)
  @Column
  read: boolean

  @Field()
  @Default(true)
  @Column
  write: boolean

  @Field()
  @Default(false)
  @Column
  configure: boolean

  @Field()
  @Default(false)
  @Column
  accepted: boolean

  @Field({
    nullable: true
  })
  @Column
  recipientId: number

  @Field({
    nullable: true
  })
  @Column
  senderId: number

  @Field({
    nullable: true
  })
  @Unique({
    msg: "This user is already in the collection.",
    name: "UNIQUE_COLLECTION_USER_IDENTIFIER"
  })
  @AllowNull
  @Column
  identifier: string

  @Field(() => Collection, {
    nullable: true
  })
  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "recipientId")
  user: User

  @Field(() => PartialUserBase, {
    nullable: true
  })
  @BelongsTo(() => User, "senderId")
  sender: User
}
