"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pulses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      action: {
        type: Sequelize.ENUM([
          "focus",
          "item-collected",
          "gallery-page-change",
          "other",
          "page-change",
          "collection-page-change",
          "auto-collect-rejected",
          "auto-collect-accepted"
        ])
      },
      route: {
        type: Sequelize.STRING
      },
      timeSpent: {
        type: Sequelize.BIGINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      device: {
        type: Sequelize.STRING
      },
      sysInfo: {
        type: Sequelize.JSON
      },
      name: {
        type: Sequelize.STRING
      }
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
