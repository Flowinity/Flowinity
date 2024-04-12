"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("Users", "homeWidgets", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null
    })
  }
}
