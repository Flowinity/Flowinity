"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Chats", "description", {
      type: Sequelize.TEXT
    })

    await queryInterface.addColumn("Chats", "background", {
      type: Sequelize.STRING
    })
  }
}
