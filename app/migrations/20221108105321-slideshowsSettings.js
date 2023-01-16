"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Slideshows", "speed", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5
    })
    await queryInterface.addColumn("Slideshows", "scaling", {
      type: Sequelize.ENUM(["stretch", "fit", "fill", "original", "tile"]),
      allowNull: false,
      defaultValue: "fit"
    })
    await queryInterface.addColumn("Slideshows", "showCaptions", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
