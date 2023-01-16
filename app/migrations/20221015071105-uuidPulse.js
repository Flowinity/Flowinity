"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    // change id to uuid
    await queryInterface.changeColumn("Pulses", "id", {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
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
