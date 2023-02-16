"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Messages", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM([
          "message",
          "leave",
          "join",
          "pin",
          "administrator",
          "rename",
          "system"
        ]),
        allowNull: true
      },
      embeds: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      edited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      editedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      replyId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      legacyUserId: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    })

    await queryInterface.createTable("Chats", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: Sequelize.ENUM(["direct", "group", "channel"])
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      legacyUserId: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    })

    await queryInterface.createTable("ChatAssociations", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rank: {
        type: Sequelize.ENUM(["owner", "admin", "member"]),
        allowNull: false
      },
      lastRead: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      notifications: {
        type: Sequelize.ENUM(["all", "none", "mentions"]),
        allowNull: false,
        defaultValue: "all"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      legacyUserId: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    })

    await queryInterface.createTable("MessageAttachments", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      messageId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      attachmentId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      legacyUserId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
