"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      userId: {
        type: Sequelize.BIGINT,
        unique: true
      },
      views: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      pageData: {
        type: Sequelize.JSON,
        defaultValue: { page: {}, stats: {}, options: { public: true } }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("bios")
  }
}
