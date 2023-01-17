"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("feedback", "feedbackText", {
      type: Sequelize.TEXT,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
