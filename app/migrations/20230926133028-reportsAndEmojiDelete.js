"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ChatEmojis", "deleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  }
}
