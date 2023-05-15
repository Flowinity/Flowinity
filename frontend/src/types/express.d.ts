import {Request} from "express"
import {User} from "@/models/user"

export interface RequestAuth extends Request {
  user: User;
}
