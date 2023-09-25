import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript"
import { User } from "@app/models/user.model"
import { Session } from "@app/models/session.model"
import { Field, ObjectType } from "type-graphql"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"

@ObjectType()
@Table
export class OauthUser extends Model {
  @Field()
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string

  @Field()
  @Column
  userId: number

  @Field()
  @Column
  oauthAppId: string

  @Field()
  @Column
  active: boolean

  @Field(() => PartialUserBase)
  @BelongsTo(() => User, "userId")
  user: User

  @HasMany(() => Session, "oauthAppId")
  sessions: Session[]
}
