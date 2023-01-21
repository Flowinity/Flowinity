import { User } from "@app/models/user.model"

type InviteFacts = {
  id: number
  inviteKey: string
  userId: number
  user: User
  status: "pending" | "accepted" | "rejected"
  facts: string[]
  registerUserId: number
}
