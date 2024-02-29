"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "banReasonType", {
      type: Sequelize.ENUM(
        "OTHER",
        "PENDING_MANUAL_ACCOUNT_DELETION",
        "ILLEGAL_CONTENT",
        "SPAM",
        "HARASSMENT",
        "UNDER_AGE"
      )
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
