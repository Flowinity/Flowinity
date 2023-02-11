import { User } from "@/models/user.model";
import { CollectionItem } from "@/models/collectionItem.model";
import { Collection } from "@/models/collection.model";
import { Star } from "@/models/star.model";
import { AutoCollectApproval } from "./autoCollectApproval.model";

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
  item: CollectionItem;
  collections: Collection[];
  items: CollectionItem[];
  starred: Star;
  autoCollectApproval: AutoCollectApproval;
}
