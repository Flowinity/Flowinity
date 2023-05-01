"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "profileLayout", {
      type: Sequelize.JSON,
      allowNull: true
    })
    await queryInterface.createTable("Integrations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: Sequelize.INTEGER,
      type: Sequelize.STRING,
      accessToken: Sequelize.STRING,
      refreshToken: Sequelize.STRING,
      expiresAt: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      tokenType: Sequelize.STRING
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
