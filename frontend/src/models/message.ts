import { User } from "@/models/user";

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
  legacyUserId?: number;
  tpuUser?: User | null;
  reply?: Message;
  legacyUser?: User | null;
  user?: User | null;
  pending?: boolean;
  error?: boolean;
  createdAt: string;
  updatedAt: string;
}
