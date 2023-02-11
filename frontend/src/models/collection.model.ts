import { User } from "@app/models/user.model";
import { CollectionItem } from "@app/models/collectionItem.model";
import { CollectionUser } from "@app/models/collectionUser.model";
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model";

export interface Collection {
  name: string;
  image: string;
  userId: number;
  shareLink: string;
  user: User;
  items: CollectionItem[];
  preview: CollectionItem;
  users: CollectionUser[];
  recipient: CollectionUser;
  autoCollectApprovals: AutoCollectApproval[];
}
