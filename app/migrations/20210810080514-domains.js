"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("domains", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      DNSProvisioned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("domains")
  }
}
