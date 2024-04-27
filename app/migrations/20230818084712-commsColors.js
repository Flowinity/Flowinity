"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "nameColor", {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
}
