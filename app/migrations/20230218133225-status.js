"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "status", {
      type: Sequelize.ENUM("online", "idle", "offline", "busy"),
      defaultValue: "offline"
    })
    await queryInterface.addColumn("Users", "storedStatus", {
      type: Sequelize.ENUM("online", "idle", "busy", "invisible"),
      defaultValue: "online"
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "status")
    await queryInterface.removeColumn("Users", "storedStatus")
  }
}
