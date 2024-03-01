"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ChatAssociations", "inviteUsed", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.removeConstraint(
      "ChatAssociations",
      "ChatAssociations_inviteUsed_foreign_idx"
    )
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
