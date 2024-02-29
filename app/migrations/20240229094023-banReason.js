"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "banReasonType", {
      type: Sequelize.ENUM(
        "OTHER",
        "PENDING_MANUAL_ACCOUNT_DELETION",
        "ILLEGAL_CONTENT",
        "SPAM",
        "HARASSMENT"
      )
    })

    await queryInterface.addColumn("Users", "banReason", {
      type: Sequelize.TEXT
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
