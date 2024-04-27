"use strict"

const { DataType } = require("sequelize-typescript")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "bot", {
      type: DataType.BOOLEAN,
      defaultValue: false
    })
  }
}
