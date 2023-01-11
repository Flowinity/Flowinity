import { Request } from "express"
import { UserModel } from "@app/types/user"
export interface RequestAuth extends Request {
  user: UserModel
}
