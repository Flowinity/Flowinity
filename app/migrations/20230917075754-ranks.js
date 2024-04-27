"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChatPermissions", {
      id: {
        type: DataType.STRING,
        primaryKey: true
      },
      description: {
        type: DataType.TEXT
      },
      name: {
        type: DataType.TEXT
      },
      createdAt: {
        type: DataType.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        type: DataType.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      group: {
        type: DataType.ENUM("ADMIN", "MANAGE", "GENERAL", "OPTIONS")
      }
    })
    await queryInterface.bulkInsert("ChatPermissions", [
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
        description: "Remove users from the group & manage invites.",
        name: "Manage Users",
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
      },
      {
        id: "TRUSTED",
        description:
          "This allows the user to update the highest rank associated to the user, and additionally users with the highest rank.\nThis is usually used subsequently with Administrator and should only be given to trusted users.",
        group: "ADMIN",
        name: "Trusted User"
      }
    ])
    await queryInterface.createTable("ChatRanks", {
      name: {
        type: DataType.TEXT
      },
      color: {
        type: DataType.STRING
      },
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataType.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      createdAt: {
        type: DataType.DATE
      },
      updatedAt: {
        type: DataType.DATE
      },
      index: {
        type: DataType.INTEGER
      },
      managed: {
        type: DataType.BOOLEAN,
        defaultValue: false
      }
    })
    await queryInterface.createTable("ChatPermissionAssociations", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      rankId: {
        type: DataType.UUID,
        allowNull: false,
        references: {
          model: "ChatRanks",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      permissionId: {
        type: DataType.STRING,
        allowNull: false,
        references: {
          model: "ChatPermissions",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        type: DataType.DATE
      },
      updatedAt: {
        type: DataType.DATE
      }
    })
    await queryInterface.createTable("ChatRankAssociations", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      rankId: {
        type: DataType.UUID,
        allowNull: false,
        references: {
          model: "ChatRanks",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      chatAssociationId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: "ChatAssociations",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        type: DataType.DATE
      },
      updatedAt: {
        type: DataType.DATE
      }
    })
  }
}
