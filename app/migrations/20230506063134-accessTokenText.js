"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Integrations", "accessToken", {
      type: Sequelize.TEXT,
      allowNull: true
    })
    await queryInterface.changeColumn("Integrations", "refreshToken", {
      type: Sequelize.TEXT,
      allowNull: true
    })
    await queryInterface.changeColumn("Integrations", "providerUsername", {
      type: Sequelize.TEXT,
      allowNull: true
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
