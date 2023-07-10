// Import Models
import { User } from "@/models/user";
import { Note } from "@/models/note";

export class NoteDataV2 {
  blocks: object[] = [];
}

export interface NoteVersion {
  id: string;
  noteId: number;
  userId: number;
  data: NoteDataV2;
  note: Note;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
