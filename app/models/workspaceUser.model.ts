import { BelongsTo, Column, DataType, Model, Table, Unique } from "sequelize-typescript"
import { Workspace } from "@app/models/workspace.model"
import { User } from "@app/models/user.model"
import { Field, Int, ObjectType } from "type-graphql"
import { DateType } from "@app/classes/graphql/serializers/date"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class WorkspaceUser extends Model {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id: number

  @Field(() => DateType)
  @Column
  createdAt: Date

  @Field(() => DateType)
  @Column
  updatedAt: Date

  @Field()
  @Column
  workspaceId: number

  @Field()
  @Column
  read: boolean

  @Field()
  @Column
  write: boolean

  @Field()
  @Column
  configure: boolean

  @Field()
  @Column
  accepted: boolean

  @Field(() => Int)
  @Column
  recipientId: number

  @Field(() => Int)
  @Column
  senderId: number

  @Field({
    nullable: true,
    description: "The unique identifier between the User and the Workspace."
  })
  @Unique
  @Column
  identifier: string

  @Field(() => Workspace)
  @BelongsTo(() => Workspace, "workspaceId")
  workspace: Workspace

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "recipientId")
  user: User

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "senderId")
  sender: User
}
