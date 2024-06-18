"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ChatRanks", "userId", {
      type: Sequelize.BIGINT,
      allowNull: true
    })
    try {
      await queryInterface.removeConstraint("ChatRanks", "chatranks_ibfk_1")
    } catch {}
  }
}
