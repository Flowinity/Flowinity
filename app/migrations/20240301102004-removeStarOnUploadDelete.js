"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Stars", "stars_ibfk_2")
    await queryInterface.changeColumn("Stars", "attachmentId", {
      type: Sequelize.BIGINT,
      references: {
        model: "Uploads",
        key: "id"
      },
      onDelete: "CASCADE"
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
