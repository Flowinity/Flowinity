import { Request } from "express";

// Import Models
import { User } from "@/models/user";

export interface RequestAuth extends Request {
  user: User;
}
