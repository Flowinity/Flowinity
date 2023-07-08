// Import Models
import {User} from "@/models/user";

export interface Upload {
  id: number;
  attachment: string;
  userId: number;
  name: string;
  originalFilename: string;
  type: "image" | "video" | "link" | "binary" | "text" | "audio" | "paste";
  urlRedirect: string;
  fileSize: number;
  deletable: boolean;
  data: object;
  textMetadata: string;
  user: User;
  //TODO
  item: any;
  collections: any[];
  items: any[];
  starred: any;
  autoCollectApproval: any;
}
