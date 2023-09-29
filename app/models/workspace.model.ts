import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { WorkspaceUser } from "@app/models/workspaceUser.model"
import { Field, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class Workspace extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field()
  @Column
  name: string

  @Field(() => Int)
  @Column
  userId: number

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field({
    nullable: true
  })
  @Column
  icon: string

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User

  @Field(() => [WorkspaceFolder])
  @HasMany(() => WorkspaceFolder, "workspaceId")
  folders: WorkspaceFolder[]

  @HasOne(() => WorkspaceFolder, "workspaceId")
  folder: WorkspaceFolder

  @HasOne(() => WorkspaceUser, "workspaceId")
  recipient: WorkspaceUser

  @HasOne(() => WorkspaceUser, "workspaceId")
  sender: WorkspaceUser

  @Field(() => [WorkspaceUser])
  @HasMany(() => WorkspaceUser, "workspaceId")
  users: WorkspaceUser[]
}
