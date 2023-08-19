import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { CollectionItem } from "@app/models/collectionItem.model"
import { CollectionUser } from "@app/models/collectionUser.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Collection extends Model {
  @Field(() => Number)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  name: string

  @Field({
    nullable: true
  })
  @AllowNull
  @Column
  image: string

  @Field()
  @Column
  userId: number

  @Field({
    nullable: true
  })
  @AllowNull
  @Column
  shareLink: string

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => [CollectionItem])
  @HasMany(() => CollectionItem, "collectionId")
  items: CollectionItem[]

  @Field(() => CollectionItem, {
    nullable: true
  })
  @HasOne(() => CollectionItem, "collectionId")
  preview: CollectionItem

  @Field(() => [CollectionUser])
  @HasMany(() => CollectionUser, "collectionId")
  users: CollectionUser[]

  @Field(() => CollectionUser, {
    nullable: true
  })
  @HasOne(() => CollectionUser, "collectionId")
  recipient: CollectionUser

  @Field(() => [AutoCollectApproval])
  @HasMany(() => AutoCollectApproval, "collectionId")
  autoCollectApprovals: AutoCollectApproval[]

  @Field(() => Boolean, {
    nullable: true
  })
  shared?: boolean

  @Field(() => Number, {
    nullable: true
  })
  itemCount?: number
}
