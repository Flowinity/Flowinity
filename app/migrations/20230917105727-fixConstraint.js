"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "ChatRankAssociations",
      "chatAssociationId"
    )
    await queryInterface.addColumn(
      "ChatRankAssociations",
      "chatAssociationId",
      {
        type: DataType.INTEGER,
        references: {
          model: "ChatAssociations",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    )
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
