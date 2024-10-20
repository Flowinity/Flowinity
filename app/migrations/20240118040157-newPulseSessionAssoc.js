"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Pulses", "sessionId", {
      type: Sequelize.BIGINT,
      references: {
        model: "Sessions",
        key: "id"
      }
    })
  }
}
