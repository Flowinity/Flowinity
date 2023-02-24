export interface Notification {
  id: number;
  message: string;
  userId: number;
  dismissed: boolean;
  route: string;
  createdAt: Date;
  updatedAt: Date;
}
