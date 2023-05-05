"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Integrations", "providerUsername", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn("Integrations", "providerUserId", {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.addColumn("Integrations", "providerUserCache", {
      type: Sequelize.JSON,
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
