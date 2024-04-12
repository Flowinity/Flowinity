"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Integrations", "providerUserId", {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: null
    })
  }
}
