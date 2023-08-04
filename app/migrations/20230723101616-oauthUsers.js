"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OauthUsers", {
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
      oauthAppId: {
        type: DataType.UUID,
        allowNull: false,
        references: {
          model: "OauthApps",
          key: "id"
        }
      },
      active: {
        type: DataType.BOOLEAN,
        defaultValue: false
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
