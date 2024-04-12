"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ChatAssociations", "inviteUsed", {
      type: Sequelize.STRING,
      allowNull: true
    })
    try {
      await queryInterface.removeConstraint(
        "ChatAssociations",
        "ChatAssociations_inviteUsed_foreign_idx"
      )
    } catch {}
  }
}
