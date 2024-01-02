import { Field, InputType, ObjectType } from "type-graphql"
import { Container } from "typedi"
import { UserUtilsService } from "@app/services/userUtils.service"
import {
  PartialUserBase,
  PartialUserFriend
} from "@app/classes/graphql/user/partialUser"
import { DateType } from "@app/classes/graphql/serializers/date"

@ObjectType()
export class ChatTypingEvent {
  @Field()
  chatId: number
  @Field(() => PartialUserFriend)
  user: PartialUserFriend
  @Field({
    nullable: true
  })
  expires: number
}
