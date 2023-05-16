import { User } from "@/models/user";

export interface Collection {
  id: number;
  name: string;
  image: string;
  userId: number;
  shareLink: string;
  //TODO
  user: User;
  items: any[];
  preview: any;
  users: any[];
  recipient: any;
  autoCollectApprovals: any[];
  permissionsMetadata: {
    configure: boolean;
    write: boolean;
    read: boolean;
  };
}
