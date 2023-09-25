import { Chat } from "@app/models/chat.model"
import { ChatRank } from "@app/models/chatRank.model"
import { ChatPermissionAssociation } from "@app/models/chatPermissionAssociation.model"
import { ChatRankAssociation } from "@app/models/chatRankAssociation.model"
import { Container } from "typedi"
import { ChatService } from "@app/services/chat.service"

export class ChatPermissionsHandler {
  public permissions: {
    id: string
    description: string
    name: string
    group: string
  }[] = [
    {
      id: "SEND_MESSAGES",
      description: "The ability to send messages in the group.",
      name: "Send Messages",
      group: "GENERAL"
    },
    {
      id: "OVERVIEW",
      description: "The ability to edit the group's name, and avatar.",
      name: "Group Overview",
      group: "ADMIN"
    },
    {
      id: "VIEW_INSIGHTS",
      description: "Ability to view the Group's Insights.",
      name: "View Insights",
      group: "GENERAL"
    },
    {
      id: "MANAGE_RANKS",
      description: "Manage assignable Group Ranks.",
      name: "Manage Ranks",
      group: "MANAGE"
    },
    {
      id: "VIEW_AUDIT_LOG",
      description: "View the Group's audit log.",
      name: "View Audit Log",
      group: "MANAGE"
    },
    {
      id: "INVITE_USERS",
      description:
        "Create shareable links to invite external users to the group.",
      name: "Invite Users",
      group: "GENERAL"
    },
    {
      id: "ADD_USERS",
      description: "Add friends to the group.",
      name: "Add Users",
      group: "MANAGE"
    },
    {
      id: "MANAGE_INTEGRATIONS",
      description: "Manage Group Integrations such as Webhooks and Bots.",
      name: "Manage Integrations",
      group: "MANAGE"
    },
    {
      id: "REMOVE_USERS",
      description: "Remove users from the group.",
      name: "Remove Users",
      group: "MANAGE"
    },
    {
      id: "BAN_USERS",
      description:
        "Ban users from the group, they will no longer be able to be added by users with the permission, or via Invite codes.",
      name: "Ban Users",
      group: "MANAGE"
    },
    {
      id: "EXTERNAL_EMOJI",
      description: "Ability to use external emoji from other groups.",
      name: "Use External Emojis",
      group: "GENERAL"
    },
    {
      id: "CREATE_EMOJI",
      description:
        "Create custom emojis for use within the group, and external groups that permit it.",
      name: "Create Custom Emojis",
      group: "MANAGE"
    },
    {
      id: "DELETE_MESSAGES",
      description: "Allow the deletion of other user's messages",
      group: "MANAGE",
      name: "Delete Messages"
    },
    {
      id: "ADMIN",
      description:
        "Grant the user full access to the Group. This includes every single permission and overrides granularly set permissions.",
      group: "ADMIN",
      name: "Administrator"
    },
    {
      id: "SEPARATE",
      description:
        "Display the member separately from others in the member list based on the highest rank.",
      group: "OPTIONS",
      name: "Separate Member Display"
    },
    {
      id: "PIN_MESSAGES",
      description: "Pin messages to the chat.",
      group: "MANAGE",
      name: "Pin Messages"
    }
  ]
  public memberPermissions = [
    "SEPARATE",
    "EXTERNAL_EMOJI",
    "INVITE_USERS",
    "SEND_MESSAGES"
  ]
  public adminPermissions = [...this.memberPermissions, "ADMIN"]
  public dmPermissions = [
    "SEPARATE",
    "EXTERNAL_EMOJI",
    "SEND_MESSAGES",
    "PIN_MESSAGES"
  ]

  async createDefaults(chat: Chat) {
    const member = await ChatRank.create({
      name: "Members",
      userId: chat.userId || 1,
      chatId: chat.id,
      managed: true,
      index: 0
    })
    let admin: ChatRank
    if (chat.type !== "direct") {
      admin = await ChatRank.create({
        name: "Administrators",
        userId: chat.userId || 1,
        chatId: chat.id,
        color: "#0190EA",
        index: 1
      })
    }

    const memberPermissions = []
    const adminPermissions = []
    for (const permission of chat.type === "direct"
      ? this.dmPermissions
      : this.memberPermissions) {
      memberPermissions.push({
        rankId: member.id,
        permissionId: permission
      })
    }

    if (chat.type !== "direct") {
      for (const permission of this.adminPermissions) {
        adminPermissions.push({
          rankId: admin!!.id,
          permissionId: permission
        })
      }
    }

    await ChatPermissionAssociation.bulkCreate([
      ...memberPermissions,
      ...adminPermissions
    ])

    const chatService = Container.get(ChatService)

    if (chat.type !== "direct") {
      await ChatRankAssociation.create({
        rankId: admin!!.id,
        chatAssociationId: chat.users.find(
          (assoc) => assoc.userId === chat.userId
        )?.id
      })
    }

    for (const user of chat.users) {
      await ChatRankAssociation.create({
        rankId: member.id,
        chatAssociationId: user.id
      })
      if (!user.userId) continue
      await chatService.getPermissions(user.userId, user.id, true)
    }
  }
}
