import {User} from "@/models/user"
import {ChatAssociation} from "@/models/chatAssociation"
import {Message} from "@/models/message"

export interface Recipient extends User {
  legacyUser: boolean;
}

export interface Typing {
  chatId: number;
  userId: number;
  user: User;
  expires: Date | string;
}

export interface Chat {
  id: number;
  type: "direct" | "group" | "channel";
  name: string;
  userId: number;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  legacyUserId: number;
  user: User;
  legacyUser: User;
  association: ChatAssociation;
  users: ChatAssociation[];
  messages: Message[];
  recipient: Recipient;
  unread: number;
  typers: Typing[];
}
