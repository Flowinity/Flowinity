"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      reportedByUserId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      reportedUserId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      uploadId: {
        type: Sequelize.BIGINT
      },
      message: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("reports")
  }
}
