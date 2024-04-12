"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "xp", {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    })
  }
}
