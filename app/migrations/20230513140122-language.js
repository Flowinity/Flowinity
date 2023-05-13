"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "language", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "en"
    })
    await queryInterface.addColumn("Users", "excludedCollections", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
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
