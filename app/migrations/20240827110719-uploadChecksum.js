"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("uploads", "sha256sum", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addIndex("uploads", ["sha256sum"])
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
