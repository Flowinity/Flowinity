import { Request } from "express"
import { User } from "@app/models/user.model"

export interface RequestAuth extends Request {
  user: User
}
