import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
  Unique
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Collection } from "@app/models/collection.model"
import { Upload } from "@app/models/upload.model"
import { Field, Int, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
@Table
export class CollectionItem extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Field()
  @Column
  collectionId: number

  @Field()
  @Column
  attachmentId: number

  @Field()
  @Column
  userId: number

  @Field({
    description:
      "Used to prevent duplicates by forming `uploadId-collectionId`. Can be null for items created before October 2022.",
    nullable: true
  })
  @Unique
  @AllowNull
  @Column
  identifier: string

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field()
  @Column({
    type: DataType.BOOLEAN
  })
  pinned: boolean

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => Collection)
  @BelongsTo(() => Collection, "collectionId")
  collection: Collection

  @Field(() => Upload)
  @BelongsTo(() => Upload, "attachmentId")
  attachment: Upload
}
