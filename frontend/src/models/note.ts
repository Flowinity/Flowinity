import { NoteVersion } from "@/models/noteVersion";

export type VersionObject = {
  createdAt: Date;
  data: object;
  userId: number;
  id: string;
};

export interface Note {
  id: number;
  name: string;
  data: object;
  metadata: object;
  workspaceFolderId: number;
  shareLink: string;
  versions: NoteVersion[];
}
