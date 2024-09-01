"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Uploads", "sha256sum", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addIndex("Uploads", ["sha256sum"])
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
