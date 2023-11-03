"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChatInvites", {
      id: {
        type: DataType.STRING,
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
      chatId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: "Chats",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        type: DataType.DATE
      },
      updatedAt: {
        type: DataType.DATE
      },
      expiredAt: {
        type: DataType.DATE,
        allowNull: true
      },
      rankId: {
        type: DataType.UUID,
        allowNull: true,
        references: {
          model: "ChatRanks",
          key: "id"
        }
      },
      invalidated: {
        type: DataType.BOOLEAN,
        defaultValue: false
      }
    })
    await queryInterface.addColumn("ChatAssociations", "inviteUsed", {
      type: DataType.STRING
    })
    await queryInterface.addColumn("OauthApps", "botId", {
      type: DataType.BIGINT,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "SET NULL"
    })
    await queryInterface.addIndex("ChatInvites", ["chatId", "invalidated"])
    await queryInterface.addIndex("OauthApps", ["botId"])
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
