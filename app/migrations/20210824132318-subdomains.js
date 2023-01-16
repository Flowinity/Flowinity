"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("subdomains", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      domainId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      zone: {
        type: Sequelize.STRING(191)
      },
      cfId: {
        type: Sequelize.STRING(191)
      },
      name: {
        type: Sequelize.STRING(191)
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("subdomains")
  }
}
