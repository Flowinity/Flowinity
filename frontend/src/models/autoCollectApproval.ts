// Import Models
import { User } from "@/models/user";
import { Collection } from "@/models/collection";
import { AutoCollectRule } from "@/models/autoCollectRule";
import { Upload } from "@/models/upload";

export interface AutoCollectApproval {
  id: number;
  autoCollectRuleId: number;
  uploadId: number;
  collectionId: number;
  userId: number;
  approved: boolean;
  info: boolean;
  user: User;
  collection: Collection;
  autoCollectRule: AutoCollectRule;
  attachment: Upload;
}
