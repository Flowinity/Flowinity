import { User } from "@/models/user";

export interface SubSubRule {
  id: number;
  type: string;
  value: string;
  operator: string;
}

export interface SubRule {
  id: number;
  rules: SubSubRule[];
}

export interface AutoCollectRule {
  id: number;
  name: string;
  enabled: boolean;
  collectionId: number;
  requireApproval: boolean;
  rules: SubRule[];
  userId: number;
  user: User;
  collection: User;
}
