"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("feedback", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      route: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      debugInfo: {
        type: Sequelize.TEXT
      },
      uploadId: {
        type: Sequelize.BIGINT
      },
      feedbackText: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      starRating: {
        type: Sequelize.INTEGER
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("feedback")
  }
}
