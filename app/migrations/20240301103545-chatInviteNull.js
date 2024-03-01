"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ChatInvites", "userId", {
      type: Sequelize.BIGINT,
      allowNull: true
    })
    await queryInterface.removeConstraint("ChatInvites", "chatinvites_ibfk_1")
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
