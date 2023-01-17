"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Slideshows", "speed", {
      type: Sequelize.FLOAT,
      defaultValue: 5
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
