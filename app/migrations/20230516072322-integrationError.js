"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Integrations", "error", {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
}
