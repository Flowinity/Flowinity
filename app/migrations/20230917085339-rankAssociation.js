"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "ChatRankAssociations",
      "userId",
      "chatAssociationId"
    )
    await queryInterface.addColumn("ChatRanks", "chatId", {
      type: DataType.INTEGER
    })
    await queryInterface.addIndex("ChatRankAssociations", ["chatAssociationId"])
    await queryInterface.addIndex("ChatRankAssociations", ["rankId"])
    await queryInterface.addIndex("ChatRanks", ["chatId"])
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
