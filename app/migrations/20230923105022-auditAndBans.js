"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChatBans", {
      id: {
        type: Sequelize.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      bannedUserId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Chats",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      ipBanned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      reason: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: DataType.DATE
      },
      updatedAt: {
        type: DataType.DATE
      }
    })

    await queryInterface.createTable("ChatAuditLogs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Chats",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      category: {
        type: Sequelize.ENUM(
          "USER",
          "RANK",
          "MESSAGE",
          "INVITE",
          "PIN_MESSAGE",
          "BOT",
          "SETTINGS",
          "EMOJI"
        )
      },
      actionType: {
        type: Sequelize.ENUM("ADD", "REMOVE", "MODIFY")
      },
      message: {
        type: DataType.TEXT
      },
      createdAt: {
        type: DataType.DATE
      },
      updatedAt: {
        type: DataType.DATE
      }
    })

    await queryInterface.createTable("ChatEmojis", {
      id: {
        type: Sequelize.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Chats",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      userId: {
        type: Sequelize.BIGINT,
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
      }
    })
    await queryInterface.createTable("ChatWebhooks", {
      id: {
        type: Sequelize.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Chats",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      userId: {
        type: Sequelize.BIGINT,
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
