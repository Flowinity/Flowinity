"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ChatAssociations", "hidden", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })

    await queryInterface.createTable("BlockedUsers", {
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
      blockedUserId: {
        type: DataType.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      silent: {
        type: DataType.BOOLEAN,
        defaultValue: false
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ChatAssociations", "hidden")
    await queryInterface.dropTable("BlockedUsers")
  }
}
