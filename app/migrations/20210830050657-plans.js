"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("plans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      quotaMax: {
        type: Sequelize.BIGINT
      },
      price: {
        type: Sequelize.BIGINT
      },
      features: {
        type: Sequelize.JSON
      },
      color: {
        type: Sequelize.STRING
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("plans")
  }
}
