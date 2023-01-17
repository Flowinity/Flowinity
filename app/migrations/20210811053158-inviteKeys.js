"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("inviteKeys", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      inviteKey: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("inviteKeys")
  }
}
