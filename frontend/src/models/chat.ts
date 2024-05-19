import { User } from "@/models/user";
import { ChatAssociation } from "@/models/chatAssociation";
import { Message } from "@/models/message";

export interface Typing {
  chatId: number;
  userId: number;
  user: User;
  expires: Date | string;
  timeout: ReturnType<typeof setTimeout>;
}

export interface Chat {
  id: number;
  type: "direct" | "group" | "channel";
  name: string;
  userId: number;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  association: ChatAssociation;
  users: ChatAssociation[];
  messages: Message[];
  recipient: User;
  unread: number;
  typers: Typing[];
}
