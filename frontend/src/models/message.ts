import { User } from "@/models/user";
import { ChatAssociation } from "@/models/chatAssociation";

export interface Message {
  id: number;
  chatId: number;
  userId?: number;
  content: string;
  type:
    | "message"
    | "leave"
    | "join"
    | "pin"
    | "administrator"
    | "rename"
    | "system";
  embeds: any[];
  edited: boolean;
  editedAt?: Date;
  replyId?: number;
  reply?: Message;
  user?: User | null;
  pending?: boolean;
  error?: boolean;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  readReceipts: ChatAssociation[];
}
